using UnityEngine;
using UnityEngine.UI;

public class SoundSlider : MonoBehaviour
{
    public Slider volumeSlider;
    public AudioSource audioSource;

    private const string VolumeKey = "Volume";

    private void Start()
    {
        // ��������� ���������� �������� �������� �� ������ ����������� ��������� ������
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

        // �������� �� ��������� �������� ��������
        volumeSlider.onValueChanged.AddListener(OnVolumeChanged);
    }

    private void OnVolumeChanged(float value)
    {
        // ��������� ��������� ������ �� ������ �������� ��������
        audioSource.volume = value;

        // ���������� �������� ��������� � PlayerPrefs
        PlayerPrefs.SetFloat(VolumeKey, value);
    }

    private void OnApplicationQuit()
    {
        // ���������� �������� ��� �������� ����
        PlayerPrefs.Save();
    }
}
