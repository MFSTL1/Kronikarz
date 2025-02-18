from Person import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Person
    path('', views.persons_list),
    path('<int:id>/', views.person_detail),

    # Surname
    path('surnames/', views.surnames_list),
    path('surname/<int:id>/', views.surname_detail),

    # Job
    path('jobs/', views.jobs_list),
    path('jobs/<int:id>/', views.job_detail),

    # EventInLife
    path('events/', views.events_list),
    path('events/<int:id>/', views.event_detail),

    # File
    path('files/', views.FileView.as_view()),
    path('files/<int:id>/', views.FileView.as_view()),

    # Image
    path('images/', views.ImageView.as_view()),
    path('images/<int:id>/', views.ImageView.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)