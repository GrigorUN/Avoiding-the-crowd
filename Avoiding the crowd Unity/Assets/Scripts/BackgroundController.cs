using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BackgroundController : MonoBehaviour
{
    public Rigidbody2D playerRigidbody;    // используем Rigidbody2D

    private void Start()
    {
        if (!playerRigidbody)
        {
            playerRigidbody = FindObjectOfType<Rigidbody2D>();
        }
    }

    private void Update()
    {
        // получаем скорость игрока при помощи его Rigidbody2D
        float playerSpeed = playerRigidbody.velocity.magnitude;

        // перемещаем фон со скоростью игрока
        transform.position += Vector3.left * playerSpeed * Time.deltaTime;

        if (transform.position.x < -20f)
        {
            transform.position += Vector3.right * 40f;
        }
    }
}