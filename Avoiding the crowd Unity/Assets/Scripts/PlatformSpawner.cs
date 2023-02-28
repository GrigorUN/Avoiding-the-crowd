using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlatformSpawner : MonoBehaviour
{
    public GameObject[] platformPrefabs; // ������ � ��������� ��������
    public GameObject[] enemyPrefabs; // ������ � ��������� �����������
    public Transform spawnPoint; // �����, ��� ����� ����������� ������ ���������
    public float platformDistance = 10f; // ���������� ����� �����������
    public float enemySpawnChance = 0.5f; // ���� ��������� ���������� �� ���������

    private float lastPlatformX; // ���������� x ��������� ��������� ���������

    void Start()
    {
        lastPlatformX = spawnPoint.position.x;
        SpawnPlatform();
    }

    void Update()
    {
        if (transform.position.x - lastPlatformX > platformDistance)
        {
            lastPlatformX = transform.position.x;
            SpawnPlatform();
        }
    }

    void SpawnPlatform()
    {
        int platformIndex = Random.Range(0, platformPrefabs.Length);
        GameObject newPlatform = Instantiate(platformPrefabs[platformIndex], transform.position, Quaternion.identity);

        // ���������, ����� �� ������� ���������� �� ���������
        if (Random.value < enemySpawnChance)
        {
            int enemyIndex = Random.Range(0, enemyPrefabs.Length);
            GameObject newEnemy = Instantiate(enemyPrefabs[enemyIndex], newPlatform.transform.position, Quaternion.identity);
            newEnemy.transform.parent = newPlatform.transform;
        }

        // ��������� ������� ������
        transform.position = new Vector3(transform.position.x + newPlatform.GetComponentInChildren<BoxCollider2D>().size.x, transform.position.y, transform.position.z);
    }
}
