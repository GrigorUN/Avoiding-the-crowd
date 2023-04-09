using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ParallaxLayer : MonoBehaviour
{
    public float speed;

    private Transform cameraTransform;
    private float spriteWidth;

    void Start()
    {
        cameraTransform = Camera.main.transform;
        spriteWidth = GetComponent<SpriteRenderer>().sprite.bounds.size.x;
    }

    void Update()
    {
        float cameraX = cameraTransform.position.x;
        float layerX = transform.position.x;

        float distance = cameraX * speed;

        transform.position = new Vector3(layerX + distance, transform.position.y, transform.position.z);

        if (cameraX - transform.position.x > spriteWidth)
        {
            transform.position = new Vector3(transform.position.x + spriteWidth * 2f, transform.position.y, transform.position.z);
        }
    }
}
