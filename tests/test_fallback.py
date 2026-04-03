import pytest
from backend.utils import generate_fallback

def test_generate_fallback_standard():
    prompt = """Create detailed AI assistant instructions for the following task:

<Task>
Write a professional email to a client.
</Task>

<Inputs>
{$client_name}
{$topic}
</Inputs>

Now write comprehensive instructions for an AI assistant to complete this task. Include:
1. Clear role definition and context
2. Important rules and constraints
3. Input variable placements
4. Examples if helpful
5. Output format specification

Write the complete prompt template:"""

    result = generate_fallback(prompt)

    assert "Write a professional email to a client." in result
    assert "{$client_name}" in result
    assert "{$topic}" in result
    assert "<Task>" in result
    assert "</Task>" in result
    assert "<Inputs>" in result
    assert "</Inputs>" in result
    assert "BEGIN TASK" in result

def test_generate_fallback_no_inputs():
    prompt = """Create detailed AI assistant instructions for the following task:

<Task>
Summarize the text.
</Task>

<Inputs>
No specific input variables defined - determine appropriate ones based on the task.
</Inputs>

Now write comprehensive instructions for an AI assistant to complete this task. Include:
1. Clear role definition and context
2. Important rules and constraints
3. Input variable placements
4. Examples if helpful
5. Output format specification

Write the complete prompt template:"""

    result = generate_fallback(prompt)

    assert "Summarize the text." in result
    assert "<Inputs>" not in result
    assert "{$" not in result
    assert "BEGIN TASK" in result

def test_generate_fallback_missing_tags():
    # Test with missing <Task> tag
    prompt1 = "Just some text without tags"
    result1 = generate_fallback(prompt1)
    assert "the specified task" in result1

    # Test with missing <Inputs> tag
    prompt2 = "<Task>Do something</Task>"
    result2 = generate_fallback(prompt2)
    assert "Do something" in result2
    assert "<Inputs>" not in result2

def test_generate_fallback_empty_task():
    prompt = "<Task></Task><Inputs></Inputs>"
    result = generate_fallback(prompt)
    assert "the specified task" not in result # because it found <Task> and </Task>, so it gets empty string
    # Actually, looking at code: task = prompt[task_start:task_end].strip() if task_start > 5 and task_end > 0 else "the specified task"
    # task_start = 0 + 6 = 6. task_end = 6. 6 > 5 and 6 > 0 is true. task = "".strip() = "".
    assert "You will be acting as an AI assistant to help with the following task.\n\n<Task>\n\n</Task>" in result
