using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FPSLimited : MonoBehaviour
{
    public int targetFPS = 60; // ������� �������� FPS

    private void Awake()
    {
        QualitySettings.vSyncCount = 0; // ��������� ������������ �������������
        Application.targetFrameRate = targetFPS; // ������������� ������� �������� FPS
    }
}

