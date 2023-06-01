using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class SoundManager : MonoBehaviour
{
    public Slider volumeSlider;

    private static SoundManager instance; // Ссылка на экземпляр SoundManager
    private static float volume = 1.0f; // Громкость звука

    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        // Проверяем, есть ли сохраненное значение громкости и применяем его
        if (PlayerPrefs.HasKey("Volume"))
        {
            volume = PlayerPrefs.GetFloat("Volume");
        }

        volumeSlider.value = volume;
        ApplyVolume();
    }

    public void OnVolumeSliderChanged()
    {
        volume = volumeSlider.value;
        ApplyVolume();
        SaveVolume();
    }

    private void ApplyVolume()
    {
        // Применяем громкость ко всем AudioSource в текущей сцене
        AudioSource[] audioSources = FindObjectsOfType<AudioSource>();
        foreach (AudioSource audioSource in audioSources)
        {
            audioSource.volume = volume;
        }
    }

    private void SaveVolume()
    {
        PlayerPrefs.SetFloat("Volume", volume);
        PlayerPrefs.Save();
    }
}
