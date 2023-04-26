using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ScoreSystem : MonoBehaviour
{
    public float score = 0f; // ���������� �����
    public float scoreMultiplier = 1f; // ��������� ��� �����, ������� ������������� � �������� �������
    public float scoreIncrement = 1f; // ���������� �����, ������� ����� �������� ������ �������
    public Text scoreText;

    private Player player; // ������ �� ������ ������ Player

    public HighScore highScore;

    void Start()
    {
        player = GameObject.FindGameObjectWithTag("Player").GetComponent<Player>(); // ���� ������ � ����� "Player" � �������� ��� ��������� Player
    }

    void Update()
    {
        if (!player.isGameOver)
        {
            // ���������, �������� �� �����
            if (Mathf.Abs(player.rb.velocity.x) > 0.1f)
            {
                // ��������� ���� ������ �������, ������� ������� ���������� ����� �� ���������
                score += scoreIncrement * scoreMultiplier * Time.deltaTime;

                // ��������� ��������� ��� �����
                scoreMultiplier += Time.deltaTime * 0.1f; // ����������� ��������� �� 0.1 ������ �������

                // ��������� ����� � ����������� �����
                scoreText.text = "Score: " + Mathf.RoundToInt(score).ToString();

                highScore.UpdateHighScore(score);
            }
        }
    }

}
