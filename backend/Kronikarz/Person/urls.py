from Person import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    # Person
    path('', views.persons_list),
    path('<int:id>/', views.person_detail),
    path('user/<int:uid>/', views.persons_by_uid),

    # Surname
    path('surnames/', views.surnames_list),
    path('surname/<int:id>/', views.surname_detail),

    # Job
    path('jobs/', views.jobs_list),
    path('jobs/<int:id>/', views.job_detail),

    # EventInLife
    path('events/', views.events_list),
    path('events/<int:id>/', views.event_detail),

    # FileInfo
    path('files/', views.files_list),
    path('files/<int:id>/', views.file_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
