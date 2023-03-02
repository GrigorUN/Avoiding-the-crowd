
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayerController : MonoBehaviour
{
    public float speed = 5f;
    public float jumpForce = 10f;
    private Rigidbody2D rb;
    private bool isGameOver = false;
    private bool hasJumped = false;
    private bool isOnPlatform = false; // флаг, указывающий, находится ли игрок на платформе

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

    void Update()
    {
        // проверяем, можно ли прыгнуть
        if ((Input.GetKeyDown(KeyCode.Space) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)) && isOnPlatform && !hasJumped && !isGameOver)
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
}
