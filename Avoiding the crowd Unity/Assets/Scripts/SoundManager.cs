using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class SoundManager : MonoBehaviour
{
    public Slider volumeSlider;

    private static SoundManager instance; // ������ �� ��������� SoundManager
    private static float volume = 1.0f; // ��������� �����

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
        // ���������, ���� �� ����������� �������� ��������� � ��������� ���
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
        // ��������� ��������� �� ���� AudioSource � ������� �����
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
