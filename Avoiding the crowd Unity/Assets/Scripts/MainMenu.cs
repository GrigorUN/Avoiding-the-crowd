using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenu : MonoBehaviour
{
    // ���������� ������� �� ������ "������ ����"
    public void StartGame()
    {
        // �������� ��������� �����, ������� ����� ��������� ������� �������
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
    }

    // ���������� ������� �� ������ "���������"
    public void OpenSettings()
    {
        // �������� �������������� ������ ��������
        // ��������, ����� ��������/��������� ����, �������� ���� � �.�.
    }

    // ���������� ������� �� ������ "�����"
    public void QuitGame()
    {
        // �������� ����������
        Debug.Log("Game is Exit");
        Application.Quit();
    }
}