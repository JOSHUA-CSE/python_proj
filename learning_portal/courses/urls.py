from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('course/<int:course_id>/', views.course_detail, name='course_detail'),
    path('quiz/<int:quiz_id>/', views.quiz_detail, name='quiz_detail'),
    path('quiz/<int:quiz_id>/take/', views.take_quiz, name='take_quiz'),
    path('course/<int:course_id>/discussions/', views.discussion_list, name='discussion_list'),
    path('discussion/<int:discussion_id>/', views.discussion_detail, name='discussion_detail'),
    path('discussion/<int:discussion_id>/comment/', views.add_comment, name='add_comment'),
] 