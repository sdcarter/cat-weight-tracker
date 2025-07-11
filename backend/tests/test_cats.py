
from app.models import Cat, User


def test_create_cat(client, test_db):
    # Test creating a cat
    response = client.post(
        "/cats/",
        json={"name": "Whiskers", "target_weight": 4.5}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Whiskers"
    assert data["target_weight"] == 4.5
    assert "id" in data

    # Verify the cat was added to the database
    cat = test_db.query(Cat).filter(Cat.id == data["id"]).first()
    assert cat is not None
    assert cat.name == "Whiskers"
    assert cat.target_weight == 4.5
    assert cat.user_id is not None  # Check that the cat is associated with a user


def test_get_cats(client, test_db):
    # Get the test user ID
    user = test_db.query(User).filter_by(username="testuser").first()
    assert user is not None, "Test user not found"

    # Add test cats to the database with user_id
    cat1 = Cat(name="Whiskers", target_weight=4.5, user_id=user.id)
    cat2 = Cat(name="Mittens", target_weight=5.0, user_id=user.id)
    test_db.add(cat1)
    test_db.add(cat2)
    test_db.commit()

    # Test getting all cats
    response = client.get("/cats/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Whiskers"
    assert data[1]["name"] == "Mittens"


def test_get_cat(client, test_db):
    # Get the test user ID
    user = test_db.query(User).filter_by(username="testuser").first()
    assert user is not None, "Test user not found"

    # Add a test cat to the database
    cat = Cat(name="Whiskers", target_weight=4.5, user_id=user.id)
    test_db.add(cat)
    test_db.commit()

    # Test getting a specific cat
    response = client.get(f"/cats/{cat.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Whiskers"
    assert data["target_weight"] == 4.5
    assert data["id"] == cat.id

    # Test getting a non-existent cat
    response = client.get("/cats/999")
    assert response.status_code == 404


def test_update_cat(client, test_db):
    # Get the test user ID
    user = test_db.query(User).filter_by(username="testuser").first()
    assert user is not None, "Test user not found"

    # Add a test cat to the database
    cat = Cat(name="Whiskers", target_weight=4.5, user_id=user.id)
    test_db.add(cat)
    test_db.commit()

    # Test updating the cat
    response = client.put(
        f"/cats/{cat.id}",
        json={"name": "Mr. Whiskers", "target_weight": 4.2}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Mr. Whiskers"
    assert data["target_weight"] == 4.2

    # Verify the cat was updated in the database
    updated_cat = test_db.query(Cat).filter(Cat.id == cat.id).first()
    assert updated_cat.name == "Mr. Whiskers"
    assert updated_cat.target_weight == 4.2


def test_delete_cat(client, test_db):
    # Get the test user ID
    user = test_db.query(User).filter_by(username="testuser").first()
    assert user is not None, "Test user not found"

    # Add a test cat to the database
    cat = Cat(name="Whiskers", target_weight=4.5, user_id=user.id)
    test_db.add(cat)
    test_db.commit()

    # Test deleting the cat
    response = client.delete(f"/cats/{cat.id}")
    assert response.status_code == 200

    # Verify the cat was deleted from the database
    deleted_cat = test_db.query(Cat).filter(Cat.id == cat.id).first()
    assert deleted_cat is None
