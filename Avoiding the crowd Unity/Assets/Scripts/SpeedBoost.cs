using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpeedBoost : MonoBehaviour
{
    public float distanceToAccelerate = 500f; // рассто€ние, на котором игрок начинает ускор€тьс€
    public float accelerationAmount = 0.5f; // количество единиц скорости, на которое ускор€етс€ игрок

    private Player player; // ссылка на объект класса Player
    private float lastAcceleratedDistance = 0f; // рассто€ние, на котором последний раз ускор€ли игрока

    void Start()
    {
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>(); // ищем объект с тегом "Player" и получаем его компонент Player
    }

    void Update()
    {
        if (!player.isGameOver)
        {
            // ¬ычисл€ем пройденное рассто€ние
            float currentDistance = player.transform.position.x;
            float distanceSinceLastAcceleration = currentDistance - lastAcceleratedDistance;

            // ≈сли пройденное рассто€ние достаточно, то ускор€ем игрока
            if (distanceSinceLastAcceleration >= distanceToAccelerate)
            {
                lastAcceleratedDistance = currentDistance;
                player.speed += accelerationAmount;
            }
        }
    }
}
