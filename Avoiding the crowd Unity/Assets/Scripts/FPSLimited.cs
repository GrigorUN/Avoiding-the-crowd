using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FPSLimited : MonoBehaviour
{
    public int targetFPS = 60; // Целевое значение FPS

    private void Awake()
    {
        QualitySettings.vSyncCount = 0; // Отключаем вертикальную синхронизацию
        Application.targetFrameRate = targetFPS; // Устанавливаем целевое значение FPS
    }
}

