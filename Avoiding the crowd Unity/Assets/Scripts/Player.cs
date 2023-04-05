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
    private Rigidbody2D rb;
    private bool isGameOver = false;
    private bool hasJumped = false;
    private bool isOnPlatform = false; // флаг, указывающий, находится ли игрок на платформе
    public Button jumpButton;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();

    }

    void FixedUpdate()
    {
        if (!isGameOver)
        {
            rb.velocity = new Vector2(speed, rb.velocity.y);
        }
    }

    public void JumpButtonPressed()
    {
        if (isOnPlatform && !hasJumped && !isGameOver)
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
            isOnPlatform = true; // игрок находится на платформе
        }
        else if (other.gameObject.CompareTag("Enemy"))
        {
            Debug.Log("Вы проиграли!");
            isGameOver = true;
            RestartGame();
        }
    }

    void OnCollisionExit2D(Collision2D other)
    {
        if (other.gameObject.CompareTag("Platform"))
        {
            isOnPlatform = false; // игрок больше не находится на платформе
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("Fall"))
        {
            Debug.Log("Вы проиграли!");
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
}


