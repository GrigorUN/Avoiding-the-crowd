using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayerController : MonoBehaviour
{
    public float speed = 5f;
    public float jumpForce = 10f;
    private Rigidbody2D rb;
    private bool isGameOver = false; // ����, �����������, ���� �� ���� ���������
    private bool hasJumped = false;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void FixedUpdate()
    {
        if (!isGameOver) // ���������, �� ����������� �� ����
        {
            rb.velocity = new Vector2(speed, rb.velocity.y);
        }
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began))
        {
            if (!hasJumped && !isGameOver)
            {
                rb.velocity = new Vector2(rb.velocity.x, jumpForce);
                hasJumped = true;
            }
        }
    }

    void OnCollisionEnter2D(Collision2D other)
    {
        if (other.gameObject.CompareTag("Platform"))
        {
            hasJumped = false;
        }
        else if (other.gameObject.CompareTag("Enemy"))
        {
            Debug.Log("�� ���������!");
            isGameOver = true; // ������ ����, ��� ���� ���������
            RestartGame(); // �������� ����� ����������� ����
        }
    }
    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("Fall"))
        {
            Debug.Log("�� ���������!");
            isGameOver = true; // ������ ����, ��� ���� ���������
            RestartGame(); // �������� ����� ����������� ����
        }
    }


    void RestartGame()
    {
        StartCoroutine(RestartDelay()); // �������� �������� �������� ����� ������������ ����
    }

    IEnumerator RestartDelay()
    {
        yield return new WaitForSeconds(0.5f); // ���� 1 ������� ����� ������������ ����
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex); // ������������� ������� �������
    }
}
