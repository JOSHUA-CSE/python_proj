from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Course, Quiz, Question, Option, Discussion, Comment
from django.contrib import messages
from django.urls import reverse

# Create your views here.

@login_required
def dashboard(request):
    courses = Course.objects.all()
    return render(request, 'courses/dashboard.html', {'courses': courses})

@login_required
def course_detail(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    quizzes = course.quizzes.all()
    discussions = course.discussions.all()
    # Get the main discussion (first one)
    main_discussion = course.discussions.first()
    comments = main_discussion.comments.all() if main_discussion else []
    if request.method == 'POST' and main_discussion:
        content = request.POST.get('content')
        if content:
            Comment.objects.create(
                discussion=main_discussion,
                content=content,
                author=request.user
            )
            messages.success(request, 'Comment added successfully!')
            return redirect('course_detail', course_id=course_id)
    return render(request, 'courses/course_detail.html', {
        'course': course,
        'quizzes': quizzes,
        'discussions': discussions,
        'main_discussion': main_discussion,
        'comments': comments
    })

@login_required
def quiz_detail(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    questions = quiz.questions.all()
    return render(request, 'courses/quiz_detail.html', {
        'quiz': quiz,
        'questions': questions
    })

@login_required
def take_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    questions = list(quiz.questions.all())
    total_questions = len(questions)
    current = int(request.GET.get('q', 1))
    if current < 1 or current > total_questions:
        current = 1
    question = questions[current-1]
    options = question.options.all()
    selected = None
    score = int(request.session.get(f'quiz_{quiz_id}_score', 0))
    answers = request.session.get(f'quiz_{quiz_id}_answers', {})

    if request.method == 'POST':
        selected = request.POST.get('option')
        answers[str(question.id)] = selected
        if selected and Option.objects.filter(id=selected, question=question, is_correct=True).exists():
            score += question.points
        request.session[f'quiz_{quiz_id}_score'] = score
        request.session[f'quiz_{quiz_id}_answers'] = answers
        if current < total_questions:
            return redirect(f"{reverse('take_quiz', args=[quiz.id])}?q={current+1}")
        else:
            final_score = score
            request.session[f'quiz_{quiz_id}_score'] = 0
            request.session[f'quiz_{quiz_id}_answers'] = {}
            return render(request, 'courses/quiz_result.html', {
                'quiz': quiz,
                'score': final_score,
                'total': sum(q.points for q in questions)
            })

    progress = int((current/total_questions)*100)
    return render(request, 'courses/take_quiz.html', {
        'quiz': quiz,
        'question': question,
        'options': options,
        'current': current,
        'total_questions': total_questions,
        'progress': progress
    })

@login_required
def discussion_list(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    discussions = course.discussions.all()
    return render(request, 'courses/discussion_list.html', {
        'course': course,
        'discussions': discussions
    })

@login_required
def discussion_detail(request, discussion_id):
    discussion = get_object_or_404(Discussion, id=discussion_id)
    comments = discussion.comments.all()
    return render(request, 'courses/discussion_detail.html', {
        'discussion': discussion,
        'comments': comments
    })

@login_required
def add_comment(request, discussion_id):
    if request.method == 'POST':
        discussion = get_object_or_404(Discussion, id=discussion_id)
        content = request.POST.get('content')
        if content:
            Comment.objects.create(
                discussion=discussion,
                content=content,
                author=request.user
            )
            messages.success(request, 'Comment added successfully!')
    return redirect('discussion_detail', discussion_id=discussion_id)
