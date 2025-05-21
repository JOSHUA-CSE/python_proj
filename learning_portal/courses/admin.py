from django.contrib import admin
from .models import Course, Quiz, Question, Option, Discussion, Comment

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('created_at',)
    fields = ('title', 'description', 'instructor', 'students', 'youtube_url', 'created_at')
    readonly_fields = ('created_at',)

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('course', 'created_at')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'quiz', 'points')
    search_fields = ('text',)
    list_filter = ('quiz',)

@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ('text', 'question', 'is_correct')
    search_fields = ('text',)
    list_filter = ('question', 'is_correct')

@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'author', 'created_at')
    search_fields = ('title', 'content')
    list_filter = ('course', 'created_at')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'discussion', 'created_at')
    search_fields = ('content',)
    list_filter = ('created_at',)
