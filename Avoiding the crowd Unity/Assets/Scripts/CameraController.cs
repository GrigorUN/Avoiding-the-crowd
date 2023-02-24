using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    public Transform target; // игрок, за которым следит камера
    public Vector3 offset; // расстояние между камерой и игроком

    void LateUpdate()
    {
        if (target != null) // проверяем, что игрок существует
        {
            transform.position = target.position + offset; // перемещаем камеру в позицию игрока с учетом смещения
        }
    }
}
