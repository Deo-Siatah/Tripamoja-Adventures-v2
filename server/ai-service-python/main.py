from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from vector_search import search
from pooling import pool_tourists
from data.mock_users import mock_users

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str


class Tourist(BaseModel):
    id: int
    name: str
    lat: float
    lng: float
    destination: str
    budget: float
    personality: str
    activities: List[str]


class PoolRequest(BaseModel):
    tourists: List[Tourist]


@app.post("/ai/search")
def ai_search(req: SearchRequest):

    results = search(req.query)

    return {"results": results}


# @app.post("/ai/pool")
# def ai_pool(req: PoolRequest):

#     tourists = [t.dict() for t in req.tourists]

#     pools = pool_tourists(tourists)

#     return pools

@app.post("/ai/pool")
def ai_pool(req: PoolRequest):

    tourists = [t.dict() for t in req.tourists]

    # frontend user
    user = tourists[0]

    # merge with backend mock users
    all_tourists = [user] + mock_users

    pools = pool_tourists(all_tourists)

    return pools