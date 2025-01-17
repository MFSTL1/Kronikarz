from rest_framework import serializers
from Person.models import Person
from .models import Position, Tree
from Parenthood.serializers import ParenthoodSerializer
from Relationship.serializers import RelationshipSerializer

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['x', 'y']

class TreePersonSerializer(serializers.ModelSerializer):
    position = serializers.SerializerMethodField()
    birthDate = serializers.CharField(source='birth.date')
    deathDate = serializers.CharField(source='death.date', allow_null=True)
    name = serializers.SerializerMethodField()
    surname = serializers.SerializerMethodField()
    image = serializers.ImageField(source='image', required=False, allow_null=True)

    class Meta:
        model = Person
        fields = ['id', 'name', 'surname', 'sex', 'image', 'birthDate', 'deathDate', 'position']

    def get_position(self, obj):
        tree = self.context.get('tree')
        if not tree:
            return None
        
        try:
            position = Position.objects.get(person=obj, tree=tree)
            return PositionSerializer(position).data
        except Position.DoesNotExist:
            return None

    def get_name(self, obj):
        return obj.names[0] if obj.names else None

    def get_surname(self, obj):
        surnames = obj.surnames.all()
        return surnames[0].surname if surnames.exists() else None


class TreeSerializer(serializers.ModelSerializer):
    people = serializers.SerializerMethodField()
    relationships = RelationshipSerializer(many=True)
    parenthoods = ParenthoodSerializer(many=True)

    class Meta:
        model = Tree
        fields = ['uid', 'id', 'name', 'people', 'relationships', 'parenthoods']

    def get_people(self, obj):
        people = obj.people.all()
        serializer = TreePersonSerializer(people, many=True, context={'tree': obj})
        return serializer.data

