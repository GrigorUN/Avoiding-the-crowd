using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class PauseMenu : MonoBehaviour
{
    public GameObject pauseMenu;
    public Button resumeButton;
    public Button restartButton;
    public Button quitButton;
    public Button jumpButton;

    private bool isPaused = false;

    void Start()
    {
        // ��� ������� ���� �������� ���� �����
        pauseMenu.SetActive(false);

        // ��������� ����������� ������� ��� ������ � ����
        resumeButton.onClick.AddListener(ResumeGame);
        restartButton.onClick.AddListener(RestartGame);
        quitButton.onClick.AddListener(QuitGame);
    }

    void Update()
    {
        // ���������, ������ �� ������ ����� (������ ��� ������� Escape)
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (isPaused)
            {
                // ���� ���� ��� �� �����, �� ���������� ����
                ResumeGame();
            }
            else
            {
                // ���� ���� �� �� �����, �� ������ � �� �����
                PauseGame();
            }
        }
    }

    public void PauseGame()
    {
        // ������ ���� �� �����
        Time.timeScale = 0f;
        isPaused = true;

        // ���������� ���� �����
        pauseMenu.SetActive(true);

        // �������� ������ ����� � ������ jumpButton
        gameObject.SetActive(false);
        jumpButton.gameObject.SetActive(false);
    }


    void ResumeGame()
    {
        // ���������� ����
        Time.timeScale = 1f;
        isPaused = false;

        // �������� ���� �����
        pauseMenu.SetActive(false);

        // ���������� ������ ����� � ������ jumpButton
        gameObject.SetActive(true);
        jumpButton.gameObject.SetActive(true);
    }

    void RestartGame()
    {
        // ���������� Time.timeScale �� 1
        Time.timeScale = 1f;

        // ������������� ������� �������
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }


    void QuitGame()
    {
        // ������������ � ������� ����
        SceneManager.LoadScene("MainMenu");
    }
}
