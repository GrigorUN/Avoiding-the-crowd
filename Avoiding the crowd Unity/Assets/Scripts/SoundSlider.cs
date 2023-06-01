using UnityEngine;
using UnityEngine.UI;

public class SoundSlider : MonoBehaviour
{
    public Slider volumeSlider;
    public AudioSource audioSource;

    private const string VolumeKey = "Volume";

    private void Awake()
    {
        // Установка начального значения ползунка на основе сохраненной громкости звуков
        if (PlayerPrefs.HasKey(VolumeKey))
        {
            float savedVolume = PlayerPrefs.GetFloat(VolumeKey);
            volumeSlider.value = savedVolume;
            audioSource.volume = savedVolume;
        }
        else
        {
            volumeSlider.value = 1f;
            audioSource.volume = 1f;
        }
    }

    private void OnEnable()
    {
        // Подписка на изменение значения ползунка
        volumeSlider.onValueChanged.AddListener(OnVolumeChanged);
    }

    private void OnDisable()
    {
        // Отписка от изменения значения ползунка
        volumeSlider.onValueChanged.RemoveListener(OnVolumeChanged);
    }

    private void OnVolumeChanged(float value)
    {
        // Изменение громкости звуков на основе значения ползунка
        audioSource.volume = value;

        // Сохранение значения громкости в PlayerPrefs
        PlayerPrefs.SetFloat(VolumeKey, value);

        // Передача значения громкости другим объектам в других сценах
        VolumeController.SetVolume(value);
    }
}
