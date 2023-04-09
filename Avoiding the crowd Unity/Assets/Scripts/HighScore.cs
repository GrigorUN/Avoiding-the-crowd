using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class HighScore : MonoBehaviour
{
    public Text scoreText;
    private float highScore;

    private void Start()
    {
        highScore = PlayerPrefs.GetFloat("HighScore", 0f);
        scoreText.text = "High Score: " + highScore.ToString("F0");
    }

    public void UpdateHighScore(float newScore)
    {
        if (newScore > highScore)
        {
            highScore = newScore;
            PlayerPrefs.SetFloat("HighScore", highScore);
            scoreText.text = "High Score: " + highScore.ToString("F0");
        }
    }
}
