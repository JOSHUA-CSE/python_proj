import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learning_portal.settings')
django.setup()

from django.contrib.auth.models import User
from courses.models import Course, Quiz, Question, Discussion, Option

# Create a superuser if it doesn't exist
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')

# Get the admin user
admin_user = User.objects.get(username='admin')

# Sample courses data
courses_data = [
    {
        'title': 'Introduction to Python Programming',
        'description': 'Learn the fundamentals of Python programming language. Topics include variables, data types, control structures, functions, and basic object-oriented programming concepts.',
    },
    {
        'title': 'Web Development with Django',
        'description': 'Master web development using Django framework. Learn to build dynamic web applications, handle databases, and implement user authentication.',
    },
    {
        'title': 'Data Structures and Algorithms',
        'description': 'Study fundamental data structures and algorithms. Topics include arrays, linked lists, trees, sorting algorithms, and basic algorithm analysis.',
    },
    {
        'title': 'Database Management Systems',
        'description': 'Learn about database design, SQL, and database management. Topics include normalization, transactions, and database optimization.',
    },
    {
        'title': 'Computer Networks',
        'description': 'Study the fundamentals of computer networking. Learn about protocols, network architecture, and network security.',
    }
]

# Create courses
for course_data in courses_data:
    course, created = Course.objects.get_or_create(
        title=course_data['title'],
        defaults={
            'description': course_data['description'],
            'instructor': admin_user
        }
    )
    
    if created:
        print(f"Created course: {course.title}")
        
        # Create a sample quiz for each course
        quiz = Quiz.objects.create(
            course=course,
            title=f"{course.title} - Quiz 1",
            description=f"Basic assessment for {course.title}"
        )
        
        # Create sample questions for the quiz
        questions = [
            {
                'text': f"What is the main topic of {course.title}?",
                'correct_answer': 'Basic concepts and fundamentals',
                'points': 2
            },
            {
                'text': f"Why is {course.title} important?",
                'correct_answer': 'It provides essential knowledge for the field',
                'points': 2
            }
        ]
        
        for q_data in questions:
            Question.objects.create(
                quiz=quiz,
                text=q_data['text'],
                points=q_data['points']
            )
        
        # Create a sample discussion
        discussion = Discussion.objects.create(
            course=course,
            title=f"Welcome to {course.title}!",
            content=f"Welcome to the {course.title} course! Feel free to introduce yourself and share your expectations for this course.",
            author=admin_user
        )

# Additional instructor courses
instructor_courses = [
    {
        'title': 'Introduction to Artificial Intelligence',
        'description': 'Explore the basics of AI, including search algorithms, knowledge representation, and simple machine learning concepts. This course is perfect for beginners interested in how computers can simulate intelligent behavior.'
    },
    {
        'title': 'Front-End Web Development with HTML, CSS, and JavaScript',
        'description': 'Learn how to build beautiful and interactive websites from scratch. This course covers HTML for structure, CSS for styling, and JavaScript for interactivity, with hands-on projects.'
    },
    {
        'title': 'Introduction to Data Science with Python',
        'description': "Dive into data analysis, visualization, and basic machine learning using Python. You'll work with libraries like pandas, matplotlib, and scikit-learn to analyze real-world datasets."
    },
    {
        'title': 'Object-Oriented Programming in Java',
        'description': 'Master the principles of object-oriented programming using Java. Topics include classes, objects, inheritance, polymorphism, and interfaces, with practical coding exercises.'
    },
    {
        'title': 'Cybersecurity Fundamentals',
        'description': 'Understand the basics of cybersecurity, including common threats, cryptography, network security, and best practices for protecting digital information.'
    }
]

for course_data in instructor_courses:
    course, created = Course.objects.get_or_create(
        title=course_data['title'],
        defaults={
            'description': course_data['description'],
            'instructor': admin_user
        }
    )
    if created:
        print(f"Created instructor course: {course.title}")
        quiz = Quiz.objects.create(
            course=course,
            title=f"{course.title} - Quiz 1",
            description=f"Basic assessment for {course.title}"
        )
        questions = [
            {
                'text': f"What is the main topic of {course.title}?",
                'correct_answer': 'Basic concepts and fundamentals',
                'points': 2
            },
            {
                'text': f"Why is {course.title} important?",
                'correct_answer': 'It provides essential knowledge for the field',
                'points': 2
            }
        ]
        for q_data in questions:
            Question.objects.create(
                quiz=quiz,
                text=q_data['text'],
                points=q_data['points']
            )
        Discussion.objects.create(
            course=course,
            title=f"Welcome to {course.title}!",
            content=f"Welcome to the {course.title} course! Feel free to introduce yourself and share your expectations for this course.",
            author=admin_user
        )

# Add a quiz to every course if it doesn't have one
for course in Course.objects.all():
    if not course.quizzes.exists():
        quiz = Quiz.objects.create(
            course=course,
            title="General Quiz",
            description=f"A general quiz for {course.title}"
        )
        Question.objects.create(
            quiz=quiz,
            text="What is the main topic of this course?",
            points=1
        )
        Question.objects.create(
            quiz=quiz,
            text="Who is the instructor of this course?",
            points=1
        )
        print(f"Added quiz to course: {course.title}")
print("All courses now have at least one quiz!")

# Define sample questions and options for each course
course_quiz_data = {
    'Introduction to Python Programming': [
        {
            'text': 'What is Python?',
            'options': [
                {'text': 'A programming language', 'is_correct': True},
                {'text': 'A type of snake', 'is_correct': False},
                {'text': 'A web browser', 'is_correct': False},
                {'text': 'A database', 'is_correct': False},
            ]
        },
        {
            'text': 'Which keyword is used to define a function in Python?',
            'options': [
                {'text': 'def', 'is_correct': True},
                {'text': 'func', 'is_correct': False},
                {'text': 'function', 'is_correct': False},
                {'text': 'define', 'is_correct': False},
            ]
        },
        {
            'text': 'What is the output of print(2 + 2)?',
            'options': [
                {'text': '4', 'is_correct': True},
                {'text': '22', 'is_correct': False},
                {'text': '2+2', 'is_correct': False},
                {'text': 'Error', 'is_correct': False},
            ]
        },
    ],
    'Web Development with Django': [
        {
            'text': 'Django is a ___ framework.',
            'options': [
                {'text': 'Web', 'is_correct': True},
                {'text': 'Mobile', 'is_correct': False},
                {'text': 'Desktop', 'is_correct': False},
                {'text': 'Game', 'is_correct': False},
            ]
        },
        {
            'text': 'Which language is Django written in?',
            'options': [
                {'text': 'Python', 'is_correct': True},
                {'text': 'Java', 'is_correct': False},
                {'text': 'C++', 'is_correct': False},
                {'text': 'PHP', 'is_correct': False},
            ]
        },
        {
            'text': 'Which command creates a new Django app?',
            'options': [
                {'text': 'python manage.py startapp', 'is_correct': True},
                {'text': 'django-admin newapp', 'is_correct': False},
                {'text': 'python create app', 'is_correct': False},
                {'text': 'django new app', 'is_correct': False},
            ]
        },
    ],
    'Data Structures and Algorithms': [
        {
            'text': 'Which data structure uses FIFO order?',
            'options': [
                {'text': 'Queue', 'is_correct': True},
                {'text': 'Stack', 'is_correct': False},
                {'text': 'Tree', 'is_correct': False},
                {'text': 'Graph', 'is_correct': False},
            ]
        },
        {
            'text': 'What is the time complexity of binary search?',
            'options': [
                {'text': 'O(log n)', 'is_correct': True},
                {'text': 'O(n)', 'is_correct': False},
                {'text': 'O(n^2)', 'is_correct': False},
                {'text': 'O(1)', 'is_correct': False},
            ]
        },
        {
            'text': 'Which of these is not a sorting algorithm?',
            'options': [
                {'text': 'Bubble sort', 'is_correct': False},
                {'text': 'Quick sort', 'is_correct': False},
                {'text': 'Merge sort', 'is_correct': False},
                {'text': 'Linear search', 'is_correct': True},
            ]
        },
    ],
    'Database Management Systems': [
        {
            'text': 'Which language is used to query databases?',
            'options': [
                {'text': 'SQL', 'is_correct': True},
                {'text': 'HTML', 'is_correct': False},
                {'text': 'CSS', 'is_correct': False},
                {'text': 'XML', 'is_correct': False},
            ]
        },
        {
            'text': 'Which is a relational database?',
            'options': [
                {'text': 'MySQL', 'is_correct': True},
                {'text': 'MongoDB', 'is_correct': False},
                {'text': 'Redis', 'is_correct': False},
                {'text': 'Neo4j', 'is_correct': False},
            ]
        },
        {
            'text': 'What does ACID stand for?',
            'options': [
                {'text': 'Atomicity, Consistency, Isolation, Durability', 'is_correct': True},
                {'text': 'Access, Control, Integrity, Data', 'is_correct': False},
                {'text': 'Array, Column, Index, Data', 'is_correct': False},
                {'text': 'None of the above', 'is_correct': False},
            ]
        },
    ],
    'Computer Networks': [
        {
            'text': 'What does TCP stand for?',
            'options': [
                {'text': 'Transmission Control Protocol', 'is_correct': True},
                {'text': 'Transfer Control Protocol', 'is_correct': False},
                {'text': 'Transmission Communication Protocol', 'is_correct': False},
                {'text': 'Transfer Communication Protocol', 'is_correct': False},
            ]
        },
        {
            'text': 'Which device forwards data packets between networks?',
            'options': [
                {'text': 'Router', 'is_correct': True},
                {'text': 'Switch', 'is_correct': False},
                {'text': 'Hub', 'is_correct': False},
                {'text': 'Repeater', 'is_correct': False},
            ]
        },
        {
            'text': 'What is the main function of DNS?',
            'options': [
                {'text': 'Translates domain names to IP addresses', 'is_correct': True},
                {'text': 'Encrypts data', 'is_correct': False},
                {'text': 'Routes packets', 'is_correct': False},
                {'text': 'Blocks spam', 'is_correct': False},
            ]
        },
    ],
}

# Add or update quizzes with these questions and options
for course_title, questions in course_quiz_data.items():
    course = Course.objects.filter(title__icontains=course_title).first()
    if not course:
        continue
    quiz = course.quizzes.first()
    if not quiz:
        quiz = Quiz.objects.create(course=course, title=f'{course.title} - Quiz', description=f'Quiz for {course.title}')
    # Remove old questions for a clean slate
    quiz.questions.all().delete()
    for qd in questions:
        q = Question.objects.create(quiz=quiz, text=qd['text'], points=1)
        for opt in qd['options']:
            Option.objects.create(question=q, text=opt['text'], is_correct=opt['is_correct'])
    print(f'Added/updated quiz for course: {course.title}')

print('All main courses now have realistic quizzes and options!')

for question in Question.objects.all():
    if question.options.count() == 0:
        Option.objects.create(question=question, text='Correct Answer', is_correct=True)
        Option.objects.create(question=question, text='Wrong Answer 1', is_correct=False)
        Option.objects.create(question=question, text='Wrong Answer 2', is_correct=False)
        Option.objects.create(question=question, text='Wrong Answer 3', is_correct=False)
        print(f"Added options to question: {question.text}")
print("All questions now have options!")

print("Sample courses, quizzes, and discussions have been created successfully!")
print("Instructor courses have been added!") 