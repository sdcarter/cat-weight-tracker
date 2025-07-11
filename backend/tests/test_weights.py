from datetime import date

from app.models import Cat, User, WeightRecord


def test_create_weight_record(client, test_db):
    # Get the test user ID
    user = test_db.query(User).filter_by(username="testuser").first()
    assert user is not None, "Test user not found"

    # Add a test cat to the database
    cat = Cat(name="Whiskers", target_weight=4.5, user_id=user.id)
    test_db.add(cat)
    test_db.commit()

    # Test creating a weight record
    response = client.post(
        f"/cats/{cat.id}/weights/",
        json={
            "date": str(date.today()),
            "user_weight": 70.0,
            "combined_weight": 74.5
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_weight"] == 70.0
    assert data["combined_weight"] == 74.5
    assert data["cat_weight"] == 4.5  # 74.5 - 70.0
    assert data["cat_id"] == cat.id

    # Verify the weight record was added to the database
    weight = test_db.query(WeightRecord).filter(WeightRecord.id == data["id"]).first()
    assert weight is not None
    assert weight.user_weight == 70.0
    assert weight.combined_weight == 74.5
    assert weight.cat_weight == 4.5


def test_get_weight_records(client, test_db):
    # Get the test user ID
    user = test_db.query(User).filter_by(username="testuser").first()
    assert user is not None, "Test user not found"

    # Add a test cat to the database
    cat = Cat(name="Whiskers", target_weight=4.5, user_id=user.id)
    test_db.add(cat)
    test_db.commit()

    # Add test weight records
    weight1 = WeightRecord(
        date=date.today(),
        user_weight=70.0,
        combined_weight=74.5,
        cat_weight=4.5,
        cat_id=cat.id
    )
    weight2 = WeightRecord(
        date=date.today(),
        user_weight=70.0,
        combined_weight=74.3,
        cat_weight=4.3,
        cat_id=cat.id
    )
    test_db.add(weight1)
    test_db.add(weight2)
    test_db.commit()

    # Test getting all weight records for a cat
    response = client.get(f"/cats/{cat.id}/weights/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["cat_weight"] == 4.5
    assert data[1]["cat_weight"] == 4.3


def test_delete_weight_record(client, test_db):
    # Get the test user ID
    user = test_db.query(User).filter_by(username="testuser").first()
    assert user is not None, "Test user not found"

    # Add a test cat to the database
    cat = Cat(name="Whiskers", target_weight=4.5, user_id=user.id)
    test_db.add(cat)
    test_db.commit()

    # Add a test weight record
    weight = WeightRecord(
        date=date.today(),
        user_weight=70.0,
        combined_weight=74.5,
        cat_weight=4.5,
        cat_id=cat.id
    )
    test_db.add(weight)
    test_db.commit()

    # Test deleting the weight record
    response = client.delete(f"/weights/{weight.id}")
    assert response.status_code == 200

    # Verify the weight record was deleted from the database
    deleted_weight = test_db.query(WeightRecord).filter(WeightRecord.id == weight.id).first()
    assert deleted_weight is None


def test_get_plot_data(client, test_db):
    # Get the test user ID
    user = test_db.query(User).filter_by(username="testuser").first()
    assert user is not None, "Test user not found"

    # Add a test cat to the database
    cat = Cat(name="Whiskers", target_weight=4.5, user_id=user.id)
    test_db.add(cat)
    test_db.commit()

    # Add test weight records
    weight1 = WeightRecord(
        date=date.today(),
        user_weight=70.0,
        combined_weight=74.5,
        cat_weight=4.5,
        cat_id=cat.id
    )
    test_db.add(weight1)
    test_db.commit()

    # Test getting plot data
    response = client.get(f"/cats/{cat.id}/plot")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Whiskers"
    assert data["target_weight"] == 4.5
    assert len(data["dates"]) == 1
    assert len(data["weights"]) == 1
    assert data["weights"][0] == 4.5
