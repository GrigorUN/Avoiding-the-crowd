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
        // При запуске игры скрываем меню паузы
        pauseMenu.SetActive(false);

        // Назначаем обработчики событий для кнопок в меню
        resumeButton.onClick.AddListener(ResumeGame);
        restartButton.onClick.AddListener(RestartGame);
        quitButton.onClick.AddListener(QuitGame);
    }

    void Update()
    {
        // Проверяем, нажата ли кнопка паузы (обычно это клавиша Escape)
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (isPaused)
            {
                // Если игра уже на паузе, то продолжаем игру
                ResumeGame();
            }
            else
            {
                // Если игра не на паузе, то ставим её на паузу
                PauseGame();
            }
        }
    }

    public void PauseGame()
    {
        // Ставим игру на паузу
        Time.timeScale = 0f;
        isPaused = true;

        // Показываем меню паузы
        pauseMenu.SetActive(true);

        // Скрываем кнопку паузы и кнопку jumpButton
        gameObject.SetActive(false);
        jumpButton.gameObject.SetActive(false);
    }


    void ResumeGame()
    {
        // Продолжаем игру
        Time.timeScale = 1f;
        isPaused = false;

        // Скрываем меню паузы
        pauseMenu.SetActive(false);

        // Показываем кнопку паузы и кнопку jumpButton
        gameObject.SetActive(true);
        jumpButton.gameObject.SetActive(true);
    }

    void RestartGame()
    {
        // Сбрасываем Time.timeScale на 1
        Time.timeScale = 1f;

        // Перезапускаем текущий уровень
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }


    void QuitGame()
    {
        // Возвращаемся в главное меню
        SceneManager.LoadScene("MainMenu");
    }
}
