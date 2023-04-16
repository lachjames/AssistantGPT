// Object Type: AddVoiceResponseModel
export interface AddVoiceResponseModel {
  voice_id: string;
}

// Object Type: Body_Add_voice_v1_voices_add_post
export interface Body_Add_voice_v1_voices_add_post {
  files: string[];
  labels: string;
  name: string;
}

// Object Type: Body_Delete_history_items_v1_history_delete_post
export interface Body_Delete_history_items_v1_history_delete_post {
  history_item_ids: string[];
}

// Object Type: Body_Download_history_items_v1_history_download_post
export interface Body_Download_history_items_v1_history_download_post {
  history_item_ids: string[];
}

// Object Type: Body_Edit_voice_v1_voices__voice_id__edit_post
export interface Body_Edit_voice_v1_voices__voice_id__edit_post {
  files?: {
    description: string;
    items: {
      format: string;
      type: string;
    };
    title: string;
    type: string;
  }[];
  labels?: {
    description: string;
    title: string;
    type: string;
  };
  name: string;
}

// Object Type: Body_Text_to_speech_v1_text_to_speech__voice_id__post
export interface VoiceSettingsResponseModel {
  // Add properties for VoiceSettingsResponseModel based on the API definition
}

export interface Body_Text_to_speech_v1_text_to_speech__voice_id__post {
  text: string;
  voice_settings?: VoiceSettingsResponseModel;
}

// Object Type: Body_Text_to_speech_v1_text_to_speech__voice_id__stream_post
export interface VoiceSettingsResponseModel {
  // Add properties for VoiceSettingsResponseModel based on the API definition
}

export interface Body_Text_to_speech_v1_text_to_speech__voice_id__stream_post {
  text: string;
  voice_settings?: VoiceSettingsResponseModel;
}

// Object Type: ExtendedSubscriptionResponseModel
export interface ExtendedSubscriptionResponseModel {
  allowed_to_extend_character_limit: boolean;
  available_models: TTSModelResponseModel[];
  can_extend_character_limit: boolean;
  can_extend_voice_limit: boolean;
  can_use_delayed_payment_methods: boolean;
  can_use_instant_voice_cloning: boolean;
  can_use_professional_voice_cloning: boolean;
  character_count: number;
  character_limit: number;
  currency: 'usd' | 'eur';
  next_character_count_reset_unix: number;
  next_invoice: InvoiceResponseModel;
  professional_voice_limit: number;
  status: 'trialing' | 'active' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'canceled' | 'unpaid' | 'free';
  tier: string;
  voice_limit: number;
}

export interface TTSModelResponseModel {
  // Define the properties of TTSModelResponseModel based on the Swagger API definition
}

export interface InvoiceResponseModel {
  // Define the properties of InvoiceResponseModel based on the Swagger API definition
}

// Object Type: FineTuningResponseModel
export interface FineTuningResponseModel {
  fine_tuning_requested: boolean;
  finetuning_state: 'not_started' | 'is_fine_tuning' | 'fine_tuned';
  is_allowed_to_fine_tune: boolean;
  model_id: string;
  slice_ids: string[];
  verification_attempts: VerificationAttemptResponseModel[];
  verification_attempts_count: number;
  verification_failures: string[];
}

export interface VerificationAttemptResponseModel {
  // Define the properties of VerificationAttemptResponseModel based on the Swagger API definition
}

// Object Type: GetHistoryResponseModel
export interface HistoryItemResponseModel {
  // Add properties for HistoryItemResponseModel here
}

export interface GetHistoryResponseModel {
  history: HistoryItemResponseModel[];
}

// Object Type: GetVoicesResponseModel
export interface GetVoicesResponseModel {
  voices: VoiceResponseModel[];
}

export interface VoiceResponseModel {
  // Define the properties of VoiceResponseModel based on the Swagger API definition
}

// Object Type: HTTPValidationError
export interface ValidationError {
  field: string;
  message: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
  title: string;
  type: string;
}

// Object Type: HistoryItemResponseModel
export interface HistoryItemResponseModel {
  history_item_id: string;
  voice_id: string;
  voice_name: string;
  text: string;
  date_unix: number;
  character_count_change_from: number;
  character_count_change_to: number;
  content_type: string;
  state: 'created' | 'deleted' | 'processing';
  settings: Record<string, unknown>;
}

// Object Type: InvoiceResponseModel
export interface InvoiceResponseModel {
  amount_due_cents: number;
  next_payment_attempt_unix: number;
}

// Object Type: LanguageResponseModel
export interface LanguageResponseModel {
  display_name: string;
  iso_code: string;
}

// Object Type: RecordingResponseModel
export interface RecordingResponseModel {
  mime_type: string;
  recording_id: string;
  size_bytes: number;
  transcription: string;
  upload_date_unix: number;
}

// Object Type: SampleResponseModel
export interface SampleResponseModel {
  file_name: string;
  hash: string;
  mime_type: string;
  sample_id: string;
  size_bytes: number;
}

// Object Type: SubscriptionResponseModel
export interface SubscriptionResponseModel {
  allowed_to_extend_character_limit: boolean;
  available_models: TTSModelResponseModel[];
  can_extend_character_limit: boolean;
  can_extend_voice_limit: boolean;
  can_use_delayed_payment_methods: boolean;
  can_use_instant_voice_cloning: boolean;
  can_use_professional_voice_cloning: boolean;
  character_count: number;
  character_limit: number;
  currency: 'usd' | 'eur';
  next_character_count_reset_unix: number;
  professional_voice_limit: number;
  status: 'trialing' | 'active' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'canceled' | 'unpaid' | 'free';
  tier: string;
  voice_limit: number;
}

export interface TTSModelResponseModel {
  // Define the properties of TTSModelResponseModel based on the Swagger API definition
}

// Object Type: TTSModelResponseModel
export interface TTSModelResponseModel {
  display_name: string;
  model_id: string;
  supported_language: LanguageResponseModel[];
}

export interface LanguageResponseModel {
  // Define the properties of LanguageResponseModel based on its schema
}

// Object Type: UserResponseModel
export interface UserResponseModel {
  is_new_user: boolean;
  subscription: SubscriptionResponseModel;
  xi_api_key: string;
}

export interface SubscriptionResponseModel {
  // Define the properties of SubscriptionResponseModel based on its schema
}

// Object Type: ValidationError
export interface ValidationError {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

// Object Type: VerificationAttemptResponseModel
export interface VerificationAttemptResponseModel {
  accepted: boolean;
  date_unix: number;
  levenshtein_distance: number;
  recording: RecordingResponseModel;
  similarity: number;
  text: string;
}

export interface RecordingResponseModel {
  // Define the properties of the RecordingResponseModel based on its own Swagger API definition
}

// Object Type: VoiceResponseModel
export interface VoiceResponseModel {
  available_for_tiers: string[];
  category: string;
  fine_tuning: FineTuningResponseModel;
  labels: { [key: string]: string };
  name: string;
  preview_url: string;
  samples: SampleResponseModel[];
  settings: VoiceSettingsResponseModel;
  voice_id: string;
}

export interface FineTuningResponseModel {
  // Define the properties of FineTuningResponseModel based on the API definition
}

export interface SampleResponseModel {
  // Define the properties of SampleResponseModel based on the API definition
}

export interface VoiceSettingsResponseModel {
  // Define the properties of VoiceSettingsResponseModel based on the API definition
}

// Object Type: VoiceSettingsResponseModel
export interface VoiceSettingsResponseModel {
  similarity_boost: number;
  stability: number;
}

export async function fetchVoiceSettings(): Promise<VoiceSettingsResponseModel> {
  const response = await fetch("https://api.example.com/voice-settings");
  if (!response.ok) {
    throw new Error("Failed to fetch voice settings");
  }
  return await response.json() as VoiceSettingsResponseModel;
}

// Path: /v1/history
export async function getGeneratedItems(apiKey: string): Promise<GetHistoryResponseModel> {
  const response = await fetch('/v1/history', {
    method: 'GET',
    headers: {
      'xi-api-key': apiKey,
    },
  });

  if (response.status === 200) {
    const data: GetHistoryResponseModel = await response.json();
    return data;
  } else if (response.status === 422) {
    const errorData: HTTPValidationError = await response.json();
    throw new Error(JSON.stringify(errorData));
  } else {
    throw new Error(`Unexpected HTTP status: ${response.status}`);
  }
}

// Path: /v1/history/{history_item_id}/audio
export async function getAudioFromHistoryItem(historyItemId: string, apiKey?: string): Promise<Response> {
  const headers: HeadersInit = {};

  if (apiKey) {
    headers['xi-api-key'] = apiKey;
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/history/${historyItemId}/audio`, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    throw new Error(`Error fetching audio from history item: ${response.statusText}`);
  }

  return response;
}

// Path: /v1/history/delete
export async function deleteHistoryItems(data: Body_Delete_history_items_v1_history_delete_post, apiKey: string): Promise<void> {
  const response = await fetch("https://api.elevenlabs.io/v1/history/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error deleting history items: ${response.statusText}`);
  }
}

// Path: /v1/history/{history_item_id}
export async function deleteHistoryItem(historyItemId: string, apiKey?: string): Promise<void> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['xi-api-key'] = apiKey;
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/history/${historyItemId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const errorData: HTTPValidationError = await response.json();
    throw new Error(`Validation Error: ${errorData.title}`);
  }
}

// Path: /v1/history/download
export async function downloadHistoryItems(body: Body_Download_history_items_v1_history_download_post, apiKey: string): Promise<void> {
  const response = await fetch("https://api.elevenlabs.io/v1/history/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Error downloading history items: ${response.statusText}`);
  }
}

// Path: /v1/voices/{voice_id}/samples/{sample_id}
export async function deleteSample(voiceId: string, sampleId: string, apiKey: string): Promise<void> {
  const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}/samples/${sampleId}`, {
    method: 'DELETE',
    headers: {
      'xi-api-key': apiKey
    }
  });

  if (!response.ok) {
    const errorData: HTTPValidationError = await response.json();
    throw new Error(`Validation Error: ${errorData.detail.map(e => `${e.field}: ${e.message}`).join(', ')}`);
  }
}

// Path: /v1/voices/{voice_id}/samples/{sample_id}/audio
export async function getAudioFromSample(voiceId: string, sampleId: string, apiKey: string): Promise<Response> {
  const url = `https://api.elevenlabs.io/v1/voices/${voiceId}/samples/${sampleId}/audio`;
  const headers = new Headers({
    'xi-api-key': apiKey
  });

  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  });

  if (!response.ok) {
    throw new Error(`Error fetching audio: ${response.statusText}`);
  }

  return response;
}

// Path: /v1/text-to-speech/{voice_id}
export async function textToSpeech(
  voiceId: string,
  apiKey: string,
  requestBody: Body_Text_to_speech_v1_text_to_speech__voice_id__post
): Promise<ArrayBuffer> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (response.status === 422) {
    const errorData: HTTPValidationError = await response.json();
    throw new Error(`Validation Error: ${JSON.stringify(errorData)}`);
  }

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

// Path: /v1/text-to-speech/{voice_id}/stream
export async function textToSpeechStream(
  voiceId: string,
  apiKey: string,
  requestBody: Body_Text_to_speech_v1_text_to_speech__voice_id__stream_post
): Promise<Response> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("xi-api-key", apiKey);

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response;
}

// Path: /v1/user/subscription
export async function getUserSubscriptionInfo(apiKey?: string): Promise<ExtendedSubscriptionResponseModel> {
  const headers: HeadersInit = {};

  if (apiKey) {
    headers['xi-api-key'] = apiKey;
  }

  const response = await fetch('/v1/user/subscription', {
    method: 'GET',
    headers: headers,
  });

  if (response.status === 200) {
    return await response.json() as ExtendedSubscriptionResponseModel;
  } else if (response.status === 422) {
    const errorResponse = await response.json() as HTTPValidationError;
    throw new Error(`Validation Error: ${JSON.stringify(errorResponse.detail)}`);
  } else {
    throw new Error(`Unexpected HTTP status: ${response.status}`);
  }
}

// Path: /v1/user
export async function getUserInfo(apiKey?: string): Promise<UserResponseModel> {
  const headers: HeadersInit = {};

  if (apiKey) {
    headers["xi-api-key"] = apiKey;
  }

  const response = await fetch("/v1/user", {
    method: "GET",
    headers: headers,
  });

  if (response.status === 200) {
    return await response.json() as UserResponseModel;
  } else if (response.status === 422) {
    const errorResponse = await response.json() as HTTPValidationError;
    throw new Error(`Validation Error: ${JSON.stringify(errorResponse.detail)}`);
  } else {
    throw new Error(`Unexpected HTTP status: ${response.status}`);
  }
}

// Path: /v1/voices
export async function getVoices(apiKey?: string): Promise<GetVoicesResponseModel> {
  const headers: HeadersInit = {};

  if (apiKey) {
    headers["xi-api-key"] = apiKey;
  }

  const response = await fetch("/v1/voices", {
    method: "GET",
    headers: headers,
  });

  if (response.status === 422) {
    const errorData: HTTPValidationError = await response.json();
    throw new Error(`Validation Error: ${JSON.stringify(errorData)}`);
  }

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data: GetVoicesResponseModel = await response.json();
  return data;
}

// Path: /v1/voices/settings/default
export async function getDefaultVoiceSettings(): Promise<VoiceSettingsResponseModel> {
  const response = await fetch("/v1/voices/settings/default");
  if (!response.ok) {
    throw new Error("Failed to fetch default voice settings");
  }
  return await response.json() as VoiceSettingsResponseModel;
}

// Path: /v1/voices/{voice_id}/settings
export async function getVoiceSettings(voiceId: string, apiKey?: string): Promise<VoiceSettingsResponseModel> {
  const headers: HeadersInit = {};

  if (apiKey) {
    headers["xi-api-key"] = apiKey;
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}/settings`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorResponse = await response.json() as HTTPValidationError;
    throw new Error(`Failed to fetch voice settings: ${errorResponse.detail.map(e => e.message).join(", ")}`);
  }

  return await response.json() as VoiceSettingsResponseModel;
}

// Path: /v1/voices/{voice_id}
export async function deleteVoice(voiceId: string, apiKey?: string): Promise<void> {
  const headers: HeadersInit = apiKey ? { "xi-api-key": apiKey } : {};

  const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error deleting voice: ${response.statusText}`);
  }
}

export async function getVoice(
  voiceId: string,
  withSettings: boolean = false,
  apiKey?: string
): Promise<VoiceResponseModel> {
  const headers: HeadersInit = apiKey ? { "xi-api-key": apiKey } : {};

  const response = await fetch(
    `https://api.elevenlabs.io/v1/voices/${voiceId}?with_settings=${withSettings}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Error getting voice: ${response.statusText}`);
  }

  return await response.json() as VoiceResponseModel;
}

// Path: /v1/voices/{voice_id}/settings/edit
export async function editVoiceSettings(voiceId: string, apiKey: string, settings: VoiceSettingsResponseModel): Promise<void> {
  const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}/settings/edit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errorData: HTTPValidationError = await response.json();
      throw new Error(`Validation Error: ${errorData.title}`);
    } else {
      throw new Error(`Failed to edit voice settings with status code: ${response.status}`);
    }
  }
}

// Path: /v1/voices/add
export async function addVoice(apiKey: string, body: Body_Add_voice_v1_voices_add_post): Promise<AddVoiceResponseModel> {
  const formData = new FormData();
  body.files.forEach((file) => formData.append("files", file));
  formData.append("labels", body.labels);
  formData.append("name", body.name);

  const response = await fetch("/v1/voices/add", {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
    },
    body: formData,
  });

  if (response.status === 422) {
    const errorData: HTTPValidationError = await response.json();
    throw new Error(`Validation Error: ${errorData.title}`);
  }

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: AddVoiceResponseModel = await response.json();
  return data;
}

// Path: /v1/voices/{voice_id}/edit
export async function editVoice(voice_id: string, apiKey: string, body: Body_Edit_voice_v1_voices__voice_id__edit_post): Promise<Response> {
  const formData = new FormData();
  if (body.files) {
    body.files.forEach((file, index) => {
      formData.append(`files[${index}][description]`, file.description);
      formData.append(`files[${index}][items][format]`, file.items.format);
      formData.append(`files[${index}][items][type]`, file.items.type);
      formData.append(`files[${index}][title]`, file.title);
      formData.append(`files[${index}][type]`, file.type);
    });
  }
  if (body.labels) {
    formData.append('labels[description]', body.labels.description);
    formData.append('labels[title]', body.labels.title);
    formData.append('labels[type]', body.labels.type);
  }
  formData.append('name', body.name);

  const response = await fetch(`/v1/voices/${voice_id}/edit`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response;
}

