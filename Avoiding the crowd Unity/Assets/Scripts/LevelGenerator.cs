using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelGenerator : MonoBehaviour
{
    public GameObject[] platforms; // ������ ��������
    public GameObject[] enemies; // ������ �����������
    public Transform player; // �����

    private float platformWidth; // ������ ���������
    private float spawnPositionX = 0f; // ��������� ������� ��� ��������� ��������
    private float safeZone = 15f; // ���������� ����, ��� �� ��������� ���������
    private int platformSpawnCount = 5; // ���������� ��������, ������� ����� ����������� � ������ ����

    private List<GameObject> activePlatforms; // ������ �������� ��������
    private List<GameObject> activeEnemies; // ������ �������� �����������

    void Start()
    {
        platformWidth = platforms[0].GetComponent<BoxCollider2D>().size.x; // �������� ������ ������ ���������
        activePlatforms = new List<GameObject>(); // ������� ����� ������ �������� ��������
        activeEnemies = new List<GameObject>(); // ������� ����� ������ �������� �����������

        // ������� ��������� ���������
        for (int i = 0; i < platformSpawnCount; i++)
        {
            SpawnPlatform();
        }
    }

    void Update()
    {
        // ���� ������� ������ ��������� ������� ��������� ��������� ����� ���������� ����, ������� ����� ��������� � ������� ����� ������
        if (player.position.x - safeZone > (spawnPositionX - platformSpawnCount * platformWidth))
        {
            SpawnPlatform();
            DeletePlatform();
        }
    }

    // ������� ����� ���������
    private void SpawnPlatform()
    {
        int platformIndex = Random.Range(0, platforms.Length); // �������� ��������� ��������� �� �������
        GameObject newPlatform = Instantiate(platforms[platformIndex], transform); // ������� ����� ���������
        newPlatform.transform.position = new Vector2(spawnPositionX, 0f); // ������������� ������� ���������
        spawnPositionX += platformWidth; // ����������� ������� ��� ��������� ���������
        activePlatforms.Add(newPlatform); // ��������� ��������� � ������ �������� ��������

        // ������� ��������� ���������� ����������� �� ���������
        int enemyCount = Random.Range(0, enemies.Length);

        for (int i = 0; i < enemyCount; i++)
        {
            int enemyIndex = Random.Range(0, enemies.Length); // �������� ���������� ���������� �� �������
            GameObject newEnemy = Instantiate(enemies[enemyIndex], transform); // ������� ������ ����������
            newEnemy.transform.position = new Vector2(Random.Range(spawnPositionX - platformWidth / 2, spawnPositionX + platformWidth / 2), Random.Range(0f, 3f)); // ������������� ������� ���������� �� ���������
            activeEnemies.Add(newEnemy); // ��������� ���������� � ������ �������� �����������
        }
    }

    // ������� ����� ������ ���������
    private void DeletePlatform()
    {
        Destroy(activePlatforms[0]);
        activePlatforms.RemoveAt(0);
        // ������� ���� �����������, ����������� �� ��������� ���������
        for (int i = activeEnemies.Count - 1; i >= 0; i--)
        {
            if (activeEnemies[i].transform.position.x < spawnPositionX - platformSpawnCount * platformWidth)
            {
                Destroy(activeEnemies[i]);
                activeEnemies.RemoveAt(i);
            }
        }
    }
}


