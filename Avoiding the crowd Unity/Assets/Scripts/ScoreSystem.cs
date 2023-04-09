using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ScoreSystem : MonoBehaviour
{
    public float score = 0f; // количество очков
    public float scoreMultiplier = 1f; // множитель дл€ очков, который увеличиваетс€ с течением времени
    public float scoreIncrement = 1f; // количество очков, которое игрок получает каждую секунду
    public Text scoreText;

    private Player player; // ссылка на объект класса Player

    public HighScore highScore;

    void Start()
    {
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>(); // ищем объект с тегом "Player" и получаем его компонент Player
    }

    void Update()
    {
        if (!player.isGameOver)
        {
            // ѕровер€ем, движетс€ ли игрок
            if (Mathf.Abs(player.rb.velocity.x) > 0.1f)
            {
                // Ќачисл€ем очки каждую секунду, умножа€ базовое количество очков на множитель
                score += scoreIncrement * scoreMultiplier * Time.deltaTime;

                // ќбновл€ем множитель дл€ очков
                scoreMultiplier += Time.deltaTime * 0.1f; // увеличиваем множитель на 0.1 каждую секунду

                // ќбновл€ем текст с количеством очков
                scoreText.text = "Score: " + Mathf.RoundToInt(score).ToString();

                highScore.UpdateHighScore(score);
            }
        }
    }

}
