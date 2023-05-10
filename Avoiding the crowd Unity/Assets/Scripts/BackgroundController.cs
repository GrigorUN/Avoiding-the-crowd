using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BackgroundController : MonoBehaviour
{
    public Rigidbody2D playerRigidbody;    // ���������� Rigidbody2D

    private void Start()
    {
        if (!playerRigidbody)
        {
            playerRigidbody = FindObjectOfType<Rigidbody2D>();
        }
    }

    private void Update()
    {
        // �������� �������� ������ ��� ������ ��� Rigidbody2D
        float playerSpeed = playerRigidbody.velocity.magnitude;

        // ���������� ��� �� ��������� ������
        transform.position += Vector3.left * playerSpeed * Time.deltaTime;

        if (transform.position.x < -20f)
        {
            transform.position += Vector3.right * 40f;
        }
    }
}