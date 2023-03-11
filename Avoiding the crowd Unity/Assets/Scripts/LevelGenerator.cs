using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelGenerator : MonoBehaviour
{

    public GameObject[] platforms;      // ������ � �����������
    public GameObject[] enemies;        // ������ � ������������
    public GameObject[] bonuses;        // ������ � ��������
    public float platformSpawnRate = 2f; // ������� ��������� ��������
    public float enemySpawnRate = 4f;    // ������� ��������� �����������
    public float bonusSpawnRate = 6f;    // ������� ��������� �������
    public float platformDestroyDelay = 2f; // ����� �� ����������� ���������
    public float enemyDestroyDelay = 5f;    // ����� �� ����������� ����������
    public float bonusDestroyDelay = 5f;    // ����� �� ����������� ������
    public Transform platformSpawnPoint;    // ����� ��� �������� ��������
    public Transform enemySpawnPoint;       // ����� ��� �������� �����������
    public Transform bonusSpawnPoint;       // ����� ��� �������� �������
    public float platformSpeed = 5f;        // �������� �������� ��������
    public float enemySpeed = 7f;           // �������� �������� �����������
    public float bonusSpeed = 10f;          // �������� �������� �������

    private float platformSpawnTimer = 0f;  // ������ ��� ��������� ��������
    private float enemySpawnTimer = 0f;     // ������ ��� ��������� �����������
    private float bonusSpawnTimer = 0f;     // ������ ��� ��������� �������

    void Start()
    {
        // ������������� ��������
        platformSpawnTimer = platformSpawnRate;
        enemySpawnTimer = enemySpawnRate;
        bonusSpawnTimer = bonusSpawnRate;
    }

    void Update()
    {
        // ��������� ������� ������� ���� ��������
        platformSpawnTimer -= Time.deltaTime;
        enemySpawnTimer -= Time.deltaTime;
        bonusSpawnTimer -= Time.deltaTime;

        // ���� ������ ��������� �����, �� ������� ���������
        if (platformSpawnTimer <= 0)
        {
            SpawnPlatform();
            platformSpawnTimer = platformSpawnRate;
        }

        // ���� ������ ���������� �����, �� ������� ����������
        if (enemySpawnTimer <= 0)
        {
            SpawnEnemy();
            enemySpawnTimer = enemySpawnRate;
        }

        // ���� ������ ������ �����, �� ������� �����
        if (bonusSpawnTimer <= 0)
        {
            SpawnBonus();
            bonusSpawnTimer = bonusSpawnRate;
        }
    }

    // ������� �������� ���������
    void SpawnPlatform
