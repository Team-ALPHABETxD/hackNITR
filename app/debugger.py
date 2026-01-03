import time
from typing import Any, Dict, List
from functools import wraps

class AgentDebugger:
    def __init__(self):
        self.events: List[Dict[str, Any]] = []

    def log_start(self, agent_name: str, state: Dict):
        self.events.append({
            "agent": agent_name,
            "event": "START",
            "timestamp": time.time(),
        })

    def log_success(self, agent_name: str):
        self.events.append({
            "agent": agent_name,
            "event": "SUCCESS",
            "timestamp": time.time(),
        })

    def log_error(self, agent_name: str, error: Exception):
        self.events.append({
            "agent": agent_name,
            "event": "ERROR",
            "timestamp": time.time(),
            "error": str(error)
        })

    def pretty_print(self):
        for e in self.events:
            print(f"[{e['event']}] {e['agent']}")

    def clear(self):
        self.events.clear()


def debug_agent(agent_name: str, debugger: AgentDebugger):
    def wrapper(fn):
        @wraps(fn)
        def wrapped(state):
            debugger.log_start(agent_name, state)
            try:
                result = fn(state)
                debugger.log_success(agent_name)
                return result
            except Exception as e:
                debugger.log_error(agent_name, e)
                raise
        return wrapped
    return wrapper
