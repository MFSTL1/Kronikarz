from rest_framework import serializers
from django.db import transaction
from .models import Person, EventInLife, Surname, Job, File, Image
from Tree.models import Tree

class EventInLifeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventInLife
        fields = '__all__'


class SurnameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Surname
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class PersonSerializer(serializers.ModelSerializer):
    tree = serializers.PrimaryKeyRelatedField(queryset=Tree.objects.all())
    birth = EventInLifeSerializer()
    death = EventInLifeSerializer(required=False)
    surnames = SurnameSerializer(many=True)
    jobs = JobSerializer(many=True, required=False)
    files = serializers.PrimaryKeyRelatedField(
        many=True, queryset=File.objects.all(), required=False
    )
    files_details = FileSerializer(source='files', many=True, read_only=True)
    image_details = FileSerializer(source='image', read_only=True)

    class Meta:
        model = Person
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        birth_data = validated_data.pop('birth')
        death_data = validated_data.pop('death', None)
        surnames_data = validated_data.pop('surnames', [])
        jobs_data = validated_data.pop('jobs', [])
        files = validated_data.pop('files', [])
        image = validated_data.pop('image', None)

        birth = EventInLife.objects.create(**birth_data)
        death = EventInLife.objects.create(**death_data) if death_data else None

        person = Person.objects.create(birth=birth, death=death, image=image, **validated_data)

        self._create_nested_objects(person, 'surnames', Surname, surnames_data)
        self._create_nested_objects(person, 'jobs', Job, jobs_data)
        person.files.set(files)

        return person

    @transaction.atomic
    def update(self, instance, validated_data):
        birth_data = validated_data.pop('birth', None)
        if birth_data:
            if instance.birth:
                instance.birth.delete()
            instance.birth = EventInLife.objects.create(**birth_data)

        death_data = validated_data.pop('death', None)
        if death_data:
            if instance.death:
                instance.death.delete()
            instance.death = EventInLife.objects.create(**death_data)
        elif instance.death:
            instance.death.delete()
            instance.death = None

        surnames_data = validated_data.pop('surnames', None)
        if surnames_data is not None:
            self._update_nested_objects(instance, 'surnames', Surname, surnames_data)

        jobs_data = validated_data.pop('jobs', None)
        if jobs_data is not None:
            self._update_nested_objects(instance, 'jobs', Job, jobs_data)

        files = validated_data.pop('files', None)
        if files is not None:
            instance.files.set(files)

        image = validated_data.pop('image', None)
        if image is not None:
            instance.image = image

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
    

    def _create_nested_objects(self, parent_instance, related_name, model_class, data_list):
        related_manager = getattr(parent_instance, related_name)
        for data in data_list:
            obj = model_class.objects.create(**data)
            related_manager.add(obj)

    def _update_nested_objects(self, instance, related_name, model_class, data_list):
        related_manager = getattr(instance, related_name)
        related_manager.all().delete()
        for data in data_list:
            obj = model_class.objects.create(**data)
            related_manager.add(obj)