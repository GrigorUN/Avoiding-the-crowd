using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpeedBoost : MonoBehaviour
{
    public float distanceToAccelerate = 500f; // ����������, �� ������� ����� �������� ����������
    public float accelerationAmount = 0.5f; // ���������� ������ ��������, �� ������� ���������� �����

    private Player player; // ������ �� ������ ������ Player
    private float lastAcceleratedDistance = 0f; // ����������, �� ������� ��������� ��� �������� ������

    void Start()
    {
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>(); // ���� ������ � ����� "Player" � �������� ��� ��������� Player
    }

    void Update()
    {
        if (!player.isGameOver)
        {
            // ��������� ���������� ����������
            float currentDistance = player.transform.position.x;
            float distanceSinceLastAcceleration = currentDistance - lastAcceleratedDistance;

            // ���� ���������� ���������� ����������, �� �������� ������
            if (distanceSinceLastAcceleration >= distanceToAccelerate)
            {
                lastAcceleratedDistance = currentDistance;
                player.speed += accelerationAmount;
            }
        }
    }
}
