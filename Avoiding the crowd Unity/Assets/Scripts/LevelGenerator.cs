using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelGenerator : MonoBehaviour
{

    public GameObject[] platforms;      // массив с платформами
    public GameObject[] enemies;        // массив с противниками
    public GameObject[] bonuses;        // массив с бонусами
    public float platformSpawnRate = 2f; // частота генерации платформ
    public float enemySpawnRate = 4f;    // частота генерации противников
    public float bonusSpawnRate = 6f;    // частота генерации бонусов
    public float platformDestroyDelay = 2f; // время до уничтожения платформы
    public float enemyDestroyDelay = 5f;    // время до уничтожения противника
    public float bonusDestroyDelay = 5f;    // время до уничтожения бонуса
    public Transform platformSpawnPoint;    // точка для создания платформ
    public Transform enemySpawnPoint;       // точка для создания противников
    public Transform bonusSpawnPoint;       // точка для создания бонусов
    public float platformSpeed = 5f;        // скорость движения платформ
    public float enemySpeed = 7f;           // скорость движения противников
    public float bonusSpeed = 10f;          // скорость движения бонусов

    private float platformSpawnTimer = 0f;  // таймер для генерации платформ
    private float enemySpawnTimer = 0f;     // таймер для генерации противников
    private float bonusSpawnTimer = 0f;     // таймер для генерации бонусов

    void Start()
    {
        // Инициализация таймеров
        platformSpawnTimer = platformSpawnRate;
        enemySpawnTimer = enemySpawnRate;
        bonusSpawnTimer = bonusSpawnRate;
    }

    void Update()
    {
        // Уменьшаем таймеры каждого типа объектов
        platformSpawnTimer -= Time.deltaTime;
        enemySpawnTimer -= Time.deltaTime;
        bonusSpawnTimer -= Time.deltaTime;

        // Если таймер платформы истек, то создаем платформу
        if (platformSpawnTimer <= 0)
        {
            SpawnPlatform();
            platformSpawnTimer = platformSpawnRate;
        }

        // Если таймер противника истек, то создаем противника
        if (enemySpawnTimer <= 0)
        {
            SpawnEnemy();
            enemySpawnTimer = enemySpawnRate;
        }

        // Если таймер бонуса истек, то создаем бонус
        if (bonusSpawnTimer <= 0)
        {
            SpawnBonus();
            bonusSpawnTimer = bonusSpawnRate;
        }
    }

    // Функция создания платформы
    void SpawnPlatform
