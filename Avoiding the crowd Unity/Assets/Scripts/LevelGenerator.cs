using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelGenerator : MonoBehaviour
{
    public GameObject[] platforms; // массив платформ
    public GameObject[] enemies; // массив противников
    public Transform player; // игрок

    private float platformWidth; // ширина платформы
    private float spawnPositionX = 0f; // начальная позиция для генерации платформ
    private float safeZone = 15f; // безопасная зона, где не создаются платформы
    private int platformSpawnCount = 5; // количество платформ, которые будут создаваться в начале игры

    private List<GameObject> activePlatforms; // список активных платформ
    private List<GameObject> activeEnemies; // список активных противников

    void Start()
    {
        platformWidth = platforms[0].GetComponent<BoxCollider2D>().size.x; // получаем ширину первой платформы
        activePlatforms = new List<GameObject>(); // создаем новый список активных платформ
        activeEnemies = new List<GameObject>(); // создаем новый список активных противников

        // создаем начальные платформы
        for (int i = 0; i < platformSpawnCount; i++)
        {
            SpawnPlatform();
        }
    }

    void Update()
    {
        // если позиция игрока превышает позицию следующей платформы минус безопасная зона, создаем новую платформу и удаляем самую старую
        if (player.position.x - safeZone > (spawnPositionX - platformSpawnCount * platformWidth))
        {
            SpawnPlatform();
            DeletePlatform();
        }
    }

    // создаем новую платформу
    private void SpawnPlatform()
    {
        int platformIndex = Random.Range(0, platforms.Length); // выбираем случайную платформу из массива
        GameObject newPlatform = Instantiate(platforms[platformIndex], transform); // создаем новую платформу
        newPlatform.transform.position = new Vector2(spawnPositionX, 0f); // устанавливаем позицию платформы
        spawnPositionX += platformWidth; // увеличиваем позицию для следующей платформы
        activePlatforms.Add(newPlatform); // добавляем платформу в список активных платформ

        // создаем случайное количество противников на платформе
        int enemyCount = Random.Range(0, enemies.Length);

        for (int i = 0; i < enemyCount; i++)
        {
            int enemyIndex = Random.Range(0, enemies.Length); // выбираем случайного противника из массива
            GameObject newEnemy = Instantiate(enemies[enemyIndex], transform); // создаем нового противника
            newEnemy.transform.position = new Vector2(Random.Range(spawnPositionX - platformWidth / 2, spawnPositionX + platformWidth / 2), Random.Range(0f, 3f)); // устанавливаем позицию противника на платформе
            activeEnemies.Add(newEnemy); // добавляем противника в список активных противников
        }
    }

    // удаляем самую старую платформу
    private void DeletePlatform()
    {
        Destroy(activePlatforms[0]);
        activePlatforms.RemoveAt(0);
        // удаляем всех противников, находящихся на удаленной платформе
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


