"""Search API endpoints — Smart Arabic search."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.text_normalizer import (
    extract_keywords,
    normalize_arabic,
    score_alias_match,
)
from app.db.session import get_db
from app.models.service import Service
from app.models.service_alias import ServiceAlias
from app.schemas.search import (
    SearchResponse,
    SearchResultItem,
    SuggestItem,
    SuggestResponse,
)

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=SearchResponse)
async def search_services(
    q: str = Query(..., min_length=1, max_length=200),
    limit: int = Query(default=10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> SearchResponse:
    """Smart search across services and aliases."""
    query_norm = normalize_arabic(q)
    keywords = extract_keywords(q)

    if not query_norm:
        return SearchResponse(
            query=q, normalized_query="", total=0, items=[]
        )

    # Collect all matches with scores
    results: dict[int, dict] = {}

    # === 1) Match by aliases (highest priority) ===
    aliases_result = await db.execute(select(ServiceAlias))
    all_aliases = aliases_result.scalars().all()

    for alias in all_aliases:
        score = score_alias_match(query_norm, alias.normalized)
        # Also try keyword-level
        if score == 0 and keywords:
            for kw in keywords:
                s = score_alias_match(kw, alias.normalized)
                if s > score:
                    score = s
        if score > 0:
            sid = alias.service_id
            total_score = score + (alias.weight * 10)
            if sid not in results or results[sid]["score"] < total_score:
                results[sid] = {
                    "score": total_score,
                    "match_type": "alias",
                    "matched_phrase": alias.phrase,
                }

    # === 2) Match by service name + description ===
    services_result = await db.execute(
        select(Service).where(Service.is_active == True)  # noqa
    )
    all_services = services_result.scalars().all()

    for service in all_services:
        name_norm = normalize_arabic(service.name)
        desc_norm = normalize_arabic(service.description or "")

        name_score = 0
        desc_score = 0

        # Query in name
        if query_norm in name_norm:
            name_score = 700 + len(query_norm)
        else:
            for kw in keywords:
                if kw in name_norm:
                    name_score = max(name_score, 500 + len(kw))

        # Query in description
        if query_norm in desc_norm:
            desc_score = 300
        else:
            for kw in keywords:
                if kw in desc_norm:
                    desc_score = max(desc_score, 150)

        total = max(name_score, desc_score)
        if total > 0:
            sid = service.id
            existing = results.get(sid, {"score": 0})
            if existing["score"] < total:
                results[sid] = {
                    "score": total,
                    "match_type": "name" if name_score >= desc_score else "description",
                    "matched_phrase": None,
                }

    # === 3) Build response items ===
    service_map = {s.id: s for s in all_services}
    sorted_results = sorted(
        results.items(), key=lambda kv: kv[1]["score"], reverse=True
    )[:limit]

    items: list[SearchResultItem] = []
    for sid, data in sorted_results:
        svc = service_map.get(sid)
        if svc is None:
            continue
        items.append(
            SearchResultItem(
                id=svc.id,
                name=svc.name,
                slug=svc.slug,
                description=svc.description,
                category_id=svc.category_id,
                match_type=data["match_type"],
                match_score=data["score"],
                matched_phrase=data.get("matched_phrase"),
            )
        )

    return SearchResponse(
        query=q,
        normalized_query=query_norm,
        total=len(items),
        items=items,
    )


@router.get("/suggest", response_model=SuggestResponse)
async def suggest(
    q: str = Query(..., min_length=1, max_length=100),
    limit: int = Query(default=8, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
) -> SuggestResponse:
    """Autocomplete suggestions while typing."""
    query_norm = normalize_arabic(q)
    if not query_norm:
        return SuggestResponse(query=q, items=[])

    suggestions: list[SuggestItem] = []
    seen_texts: set[str] = set()

    # Service names that match
    services_result = await db.execute(
        select(Service).where(Service.is_active == True)  # noqa
    )
    for svc in services_result.scalars().all():
        name_norm = normalize_arabic(svc.name)
        if query_norm in name_norm:
            if svc.name not in seen_texts:
                suggestions.append(
                    SuggestItem(
                        text=svc.name,
                        type="service",
                        service_id=svc.id,
                        service_slug=svc.slug,
                    )
                )
                seen_texts.add(svc.name)

    # Alias phrases that match
    aliases_result = await db.execute(select(ServiceAlias))
    for alias in aliases_result.scalars().all():
        if query_norm in alias.normalized:
            if alias.phrase not in seen_texts:
                suggestions.append(
                    SuggestItem(
                        text=alias.phrase,
                        type="alias",
                        service_id=alias.service_id,
                    )
                )
                seen_texts.add(alias.phrase)
        if len(suggestions) >= limit * 2:
            break

    # Sort: shorter strings first (more relevant)
    suggestions.sort(key=lambda s: len(s.text))

    return SuggestResponse(query=q, items=suggestions[:limit])