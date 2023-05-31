using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.Animations;

public class Player : MonoBehaviour
{
    public Animator animator;
    public float speed = 5f;
    public float jumpForce = 10f;
    public Rigidbody2D rb;
    public bool isGameOver = false;
    private bool hasJumped = false;
    private bool isOnPlatform = false; // флаг, указывающий, находится ли игрок на платформе
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
            animator.SetFloat("Speed", 0);
            animator.SetBool("Jump", true);
            hasJumped = true;
            Debug.Log("ПРЫЖОК");
        }
    }

    void OnCollisionEnter2D(Collision2D other)
    {
        if (other.gameObject.CompareTag("Platform"))
        {
            
            hasJumped = false;
            isOnPlatform = true; // игрок находится на платформе
            animator.SetBool("Jump", false);
            Debug.Log("Платформа");
        }
        else if (other.gameObject.CompareTag("Enemy"))
        {
            animator.SetFloat("Speed", 0);
            animator.SetBool("dead", true);
            Debug.Log("Вы проиграли!");
            isGameOver = true;
            RestartGame();
        }
    }

    void OnCollisionExit2D(Collision2D other)
    {
        if (other.gameObject.CompareTag("Platform"))
        {
            animator.SetFloat("Speed", 0);
            animator.SetBool("Jump", true);
            isOnPlatform = false;
            Debug.Log("НЕ Платформа");// игрок больше не находится на платформе
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
        yield return new WaitForSeconds(1f);
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
            animator.SetFloat("Speed", 1);
            Debug.Log("NNNN");
            StartGame();
        }
    }
}
