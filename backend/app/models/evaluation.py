from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class TestCase(BaseModel):
    name: str
    description: str
    expected: str
    actual: Optional[str] = None
    passed: bool
    details: Optional[str] = None

class EvaluationSuite(BaseModel):
    lab_id: int
    lab_title: str
    evaluation_type: str  # assertions, ground_truth, safety_policy, adversarial
    total_tests: int
    passed_tests: int
    failed_tests: int
    score_percentage: float
    test_cases: List[TestCase] = []
    summary: str

class EvaluationOverview(BaseModel):
    total_suites: int
    total_tests: int
    overall_passed: int
    overall_failed: int
    overall_pass_rate: float
    suites: List[EvaluationSuite]
