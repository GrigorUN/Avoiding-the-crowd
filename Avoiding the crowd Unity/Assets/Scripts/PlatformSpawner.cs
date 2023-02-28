using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlatformSpawner : MonoBehaviour
{
    public GameObject[] platformPrefabs; // массив с префабами платформ
    public GameObject[] enemyPrefabs; // массив с префабами противников
    public Transform spawnPoint; // точка, где будет создаваться первая платформа
    public float platformDistance = 10f; // расстояние между платформами
    public float enemySpawnChance = 0.5f; // шанс появления противника на платформе

    private float lastPlatformX; // координата x последней созданной платформы

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

        // проверяем, нужно ли создать противника на платформе
        if (Random.value < enemySpawnChance)
        {
            int enemyIndex = Random.Range(0, enemyPrefabs.Length);
            GameObject newEnemy = Instantiate(enemyPrefabs[enemyIndex], newPlatform.transform.position, Quaternion.identity);
            newEnemy.transform.parent = newPlatform.transform;
        }

        // обновляем позицию спавна
        transform.position = new Vector3(transform.position.x + newPlatform.GetComponentInChildren<BoxCollider2D>().size.x, transform.position.y, transform.position.z);
    }
}
