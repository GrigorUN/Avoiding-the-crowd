using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenu : MonoBehaviour
{
    // Обработчик нажатия на кнопку "Начать игру"
    public void StartGame()
    {
        // Загрузка следующей сцены, которая будет содержать игровой уровень
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
    }

    // Обработчик нажатия на кнопку "Настройки"
    public void OpenSettings()
    {
        // Открытие дополнительной панели настроек
        // Например, можно включить/выключить звук, изменить язык и т.д.
    }

    // Обработчик нажатия на кнопку "Выход"
    public void QuitGame()
    {
        // Закрытие приложения
        Debug.Log("Game is Exit");
        Application.Quit();
    }
}