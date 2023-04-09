using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class Player : MonoBehaviour
{
    public float speed = 5f;
    public float jumpForce = 10f;
    public Rigidbody2D rb;
    public bool isGameOver = false;
    private bool hasJumped = false;
    private bool isOnPlatform = false; // ����, �����������, ��������� �� ����� �� ���������
    public Button jumpButton;
    private bool gameStarted = false;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();

    }

    void FixedUpdate()
    {
        if (!isGameOver && gameStarted)
        {
            rb.velocity = new Vector2(speed, rb.velocity.y);
        }
    }

    public void JumpButtonPressed()
    {
        if (isOnPlatform && !hasJumped && !isGameOver && gameStarted)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
            hasJumped = true;
        }
    }

    void OnCollisionEnter2D(Collision2D other)
    {
        if (other.gameObject.CompareTag("Platform"))
        {
            hasJumped = false;
            isOnPlatform = true; // ����� ��������� �� ���������
        }
        else if (other.gameObject.CompareTag("Enemy"))
        {
            Debug.Log("�� ���������!");
            isGameOver = true;
            RestartGame();
        }
    }

    void OnCollisionExit2D(Collision2D other)
    {
        if (other.gameObject.CompareTag("Platform"))
        {
            isOnPlatform = false; // ����� ������ �� ��������� �� ���������
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("Fall"))
        {
            Debug.Log("�� ���������!");
            isGameOver = true;
            RestartGame();
        }
    }

    void RestartGame()
    {
        StartCoroutine(RestartDelay());
    }

    IEnumerator RestartDelay()
    {
        yield return new WaitForSeconds(0.5f);
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }

    internal Vector3 GetPosition()
    {
        throw new NotImplementedException();
    }

    public void StartGame()
    {
        gameStarted = true;
    }

    void Update()
    {
        if (Input.touchCount > 0 && !gameStarted)
        {
            StartGame();
        }
    }
}
