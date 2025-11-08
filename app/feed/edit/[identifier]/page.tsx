'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/app/context/AuthContext';
import { GeneratedPageData } from '@/app/types';
import { EditIcon, EyeIcon, TrashIcon } from '@/app/components/Icons';

interface EditableImage {
  id: string;
  url: string;
  alt: string;
  uploading?: boolean;
  error?: string;
}

interface EditableService {
  title: string;
  description: string;
  icon?: string;
  timeline?: string;
  summary?: string;
  role?: string;
  team?: string;
  outcome?: string;
  image?: string;
}

interface EditableSkillGroup {
  id: string;
  category: string;
  items: string;
}

interface EditableTestimonial {
  name: string;
  role: string;
  quote: string;
  rating?: number;
}

interface EditableFaq {
  question: string;
  answer: string;
}

type SectionKey = keyof NonNullable<GeneratedPageData['sections']>;

export default function EditGeneratedPage() {
  const params = useParams<{ identifier: string }>();
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();

  const identifier = useMemo(() => {
    const raw = params?.identifier;
    if (!raw) {
      return '';
    }
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [form, setForm] = useState<GeneratedPageData | null>(null);
  const [pageSlug, setPageSlug] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [contactFieldsText, setContactFieldsText] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [seoKeywordsText, setSeoKeywordsText] = useState('');
  const [services, setServices] = useState<EditableService[]>([]);
  const [testimonials, setTestimonials] = useState<EditableTestimonial[]>([]);
  const [faqs, setFaqs] = useState<EditableFaq[]>([]);
  const [images, setImages] = useState<EditableImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [skills, setSkills] = useState<EditableSkillGroup[]>([]);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [sectionsEnabled, setSectionsEnabled] = useState({
    features: true,
    services: true,
    testimonials: true,
    faq: true,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const createImageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createSkillId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const previewHref = useMemo(() => {
    if (pageSlug) {
      return `/${pageSlug}`;
    }
    if (!identifier) {
      return '/';
    }
    return `/${identifier}`;
  }, [identifier, pageSlug]);

  const ensureSectionShape = (sections?: GeneratedPageData['sections']) => ({
    ...sections,
    about: sections?.about ?? '',
    callToAction: sections?.callToAction ?? '',
    features: sections?.features ?? [],
    visibility: {
      features: sections?.visibility?.features ?? true,
      services: sections?.visibility?.services ?? true,
      testimonials: sections?.visibility?.testimonials ?? true,
      faq: sections?.visibility?.faq ?? true,
    },
  });

  const updateSectionField = (field: SectionKey, value: any) => {
    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        sections: {
          ...ensureSectionShape(prev.sections),
          [field]: value,
        },
      };
    });
  };

  useEffect(() => {
    if (!identifier) {
      return;
    }

    if (authLoading) {
      return;
    }

    if (!token) {
      setError('Please login to edit your website.');
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`/api/pages/${identifier}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload?.message || 'Failed to load page');
        }

        return res.json();
      })
      .then((payload) => {
        const pageData = payload?.page?.json as GeneratedPageData | undefined;
        if (!pageData) {
          throw new Error('Page data missing');
        }

        setForm(pageData);
        setPageSlug(payload?.page?.slug);
        setContactFieldsText((pageData.contact_fields || []).join('\n'));
        setFeaturesText((pageData.sections?.features || []).join('\n'));
        setSeoKeywordsText((pageData.seoKeywords || []).join(', '));
        setServices((pageData.sections?.services || []).map((service) => ({
          title: service?.title || '',
          description: service?.description || '',
          icon: service?.icon || '',
          timeline: service?.timeline || '',
          summary: service?.summary || '',
          role: service?.role || '',
          team: service?.team || '',
          outcome: service?.outcome || '',
          image: service?.image || '',
        })));
        setTestimonials((pageData.sections?.testimonials || []).map((testimonial) => ({
          name: testimonial?.name || '',
          role: testimonial?.role || '',
          quote: testimonial?.quote || '',
          rating: testimonial?.rating || 5,
        })));
        setFaqs((pageData.sections?.faq || []).map((item) => ({
          question: item?.question || '',
          answer: item?.answer || '',
        })));
        setSkills((pageData.sections?.skills || []).map((group, index) => {
          const normalizedItems = Array.isArray(group?.items)
            ? (group?.items as string[]).map((item) => (item || '').trim()).filter(Boolean).join(', ')
            : '';

          return {
            id: `${createSkillId()}-${index}`,
            category: group?.category || '',
            items: normalizedItems,
          };
        }));
        const initialImages: EditableImage[] = (pageData.pics || []).map((url, index) => ({
          id: createImageId(),
          url,
          alt: pageData.picDescriptions?.[index] || '',
        }));
        setImages(initialImages);
        const visibility = pageData.sections?.visibility;
        setSectionsEnabled({
          features: visibility?.features ?? (pageData.sections?.features?.length || 0) > 0,
          services: visibility?.services ?? (pageData.sections?.services?.length || 0) > 0,
          testimonials: visibility?.testimonials ?? (pageData.sections?.testimonials?.length || 0) > 0,
          faq: visibility?.faq ?? (pageData.sections?.faq?.length || 0) > 0,
        });
        setError('');
      })
      .catch((err: Error) => {
        console.error('Failed to load page', err);
        setError(err.message || 'Failed to load page');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [identifier, authLoading, token]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form || !token) {
      return;
    }

    setSaving(true);
    setStatusMessage(null);
  const MIN_SAVE_DURATION = 1200;
  const saveStartTime = Date.now();

    const listFromText = (value: string, splitter: RegExp) => value
      .split(splitter)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    const contactList = listFromText(contactFieldsText, /\n+/);
    const featureList = listFromText(featuresText, /\n+/);
    const keywordList = listFromText(seoKeywordsText.replace(/\n/g, ','), /,/);

    if (images.some((image) => image.uploading)) {
      setSaving(false);
      setStatusMessage({ type: 'error', message: 'Please wait for image uploads to finish before saving.' });
      return;
    }

    const normalizedImages = images
      .map((image) => ({
        url: image.url.trim(),
        alt: image.alt.trim(),
      }))
      .filter((image) => image.url.length > 0);

    if (normalizedImages.length === 0) {
      setSaving(false);
      setStatusMessage({ type: 'error', message: 'Add at least one image before saving.' });
      return;
    }

    const serviceList = services
      .map((service) => {
        const title = service.title.trim();
        const description = service.description.trim();
        const icon = service.icon?.trim() || undefined;
        const timeline = service.timeline?.trim() || undefined;
        const summary = service.summary?.trim() || undefined;
        const role = service.role?.trim() || undefined;
        const team = service.team?.trim() || undefined;
        const outcome = service.outcome?.trim() || undefined;
        const image = service.image?.trim() || undefined;

        if (!title && !description) {
          return null;
        }

        const payloadService: Record<string, string> & { title: string; description: string } = {
          title,
          description,
        };

        if (icon) payloadService.icon = icon;
        if (timeline) payloadService.timeline = timeline;
        if (summary) payloadService.summary = summary;
        if (role) payloadService.role = role;
        if (team) payloadService.team = team;
        if (outcome) payloadService.outcome = outcome;
        if (image) payloadService.image = image;

        return payloadService;
      })
      .filter((item): item is { title: string; description: string } & Record<string, string> => Boolean(item));

    const skillList = skills
      .map((group) => {
        const category = group.category.trim();
        const items = group.items
          .split(/[,;\n]+/)
          .map((entry) => entry.trim())
          .filter((entry) => entry.length > 0);

        if (!category && items.length === 0) {
          return null;
        }

        return {
          category: category || 'General',
          items,
        };
      })
      .filter((group): group is { category: string; items: string[] } => Boolean(group));

    const testimonialList = testimonials
      .map((testimonial) => ({
        name: testimonial.name.trim(),
        role: testimonial.role.trim(),
        quote: testimonial.quote.trim(),
        rating: typeof testimonial.rating === 'number' ? Math.min(5, Math.max(1, testimonial.rating)) : 5,
      }))
      .filter((testimonial) => testimonial.name.length > 0 && testimonial.quote.length > 0);

    const faqList = faqs
      .map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .filter((item) => item.question.length > 0 && item.answer.length > 0);

    const visibilitySettings = {
      features: sectionsEnabled.features,
      services: sectionsEnabled.services,
      testimonials: sectionsEnabled.testimonials,
      faq: sectionsEnabled.faq,
    };

    const payload: GeneratedPageData = {
      ...form,
      contact_fields: contactList,
      pics: normalizedImages.map((image) => image.url),
      picDescriptions: normalizedImages.map((image) => image.alt || form.title),
      seoKeywords: keywordList,
      sections: {
        ...ensureSectionShape(form.sections),
        features: featureList,
        services: serviceList,
        testimonials: testimonialList,
        faq: faqList,
        skills: skillList,
        visibility: visibilitySettings,
      },
    };

    try {
      const response = await fetch(`/api/pages/${identifier}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ json: payload }),
      });

      if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        throw new Error(info?.message || 'Failed to save changes');
      }

      setForm(payload);
      setContactFieldsText(contactList.join('\n'));
      setFeaturesText(featureList.join('\n'));
      setSeoKeywordsText(keywordList.join(', '));
      setServices(serviceList);
      setTestimonials(testimonialList);
      setFaqs(faqList);
      setSkills(skillList.map((group, index) => ({
        id: `${createSkillId()}-${index}`,
        category: group.category,
        items: group.items.join(', '),
      })));
      setSectionsEnabled(visibilitySettings);
      setImages(normalizedImages.map((image) => ({
        id: createImageId(),
        url: image.url,
        alt: image.alt,
      })));
      setStatusMessage({ type: 'success', message: 'Changes saved successfully. Preview refreshed!' });
    } catch (err: any) {
      console.error('Failed to save page', err);
      setStatusMessage({ type: 'error', message: err.message || 'Failed to save changes' });
    } finally {
      const elapsed = Date.now() - saveStartTime;
      const waitTime = MIN_SAVE_DURATION - elapsed;
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
      setSaving(false);
    }
  };

  const addService = () => setServices((prev) => [...prev, {
    title: '',
    description: '',
    icon: '',
    timeline: '',
    summary: '',
    role: '',
    team: '',
    outcome: '',
    image: '',
  }]);
  const removeService = (index: number) => setServices((prev) => prev.filter((_, idx) => idx !== index));
  const updateService = (index: number, field: keyof EditableService, value: string) => {
    setServices((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleServiceGallerySelect = (serviceIndex: number, url: string) => {
    updateService(serviceIndex, 'image', url);
  };

  const addTestimonial = () => setTestimonials((prev) => [...prev, { name: '', role: '', quote: '', rating: 5 }]);
  const removeTestimonial = (index: number) => setTestimonials((prev) => prev.filter((_, idx) => idx !== index));
  const updateTestimonial = (index: number, field: keyof EditableTestimonial, value: string | number) => {
    setTestimonials((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addFaq = () => setFaqs((prev) => [...prev, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setFaqs((prev) => prev.filter((_, idx) => idx !== index));
  const updateFaq = (index: number, field: keyof EditableFaq, value: string) => {
    setFaqs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addSkillGroup = () => setSkills((prev) => [...prev, {
    id: createSkillId(),
    category: '',
    items: '',
  }]);

  const removeSkillGroup = (id: string) => setSkills((prev) => prev.filter((group) => group.id !== id));

  const updateSkillGroup = (id: string, field: keyof Omit<EditableSkillGroup, 'id'>, value: string) => {
    setSkills((prev) => prev.map((group) => (
      group.id === id
        ? {
            ...group,
            [field]: value,
          }
        : group
    )));
  };

  const handleImageAltChange = (index: number, value: string) => {
    setImages((prev) => {
      const next = [...prev];
      if (!next[index]) {
        return prev;
      }
      next[index] = { ...next[index], alt: value };
      return next;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    setImages((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) {
        return prev;
      }
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    void handleImageFiles(files);
    event.target.value = '';
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    if (!token) {
      setStatusMessage({ type: 'error', message: 'Please login again to upload images.' });
      return;
    }

    const uploads = Array.from(files).map(async (file) => {
      const tempId = createImageId();
      const previewUrl = URL.createObjectURL(file);
      const baseAlt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();

      setImages((prev) => [
        ...prev,
        {
          id: tempId,
          url: previewUrl,
          alt: baseAlt,
          uploading: true,
        },
      ]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/uploads', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const info = await response.json().catch(() => ({}));
          throw new Error(info?.message || 'Failed to upload image');
        }

        const result = await response.json();

        setImages((prev) => prev.map((image) => (
          image.id === tempId
            ? {
                ...image,
                url: result.url,
                uploading: false,
                error: undefined,
              }
            : image
        )));
      } catch (uploadError: any) {
        console.error('Image upload failed', uploadError);
        setStatusMessage({
          type: 'error',
          message: uploadError.message || 'Image upload failed. Please try again.',
        });
        setImages((prev) => prev.filter((image) => image.id !== tempId));
      } finally {
        URL.revokeObjectURL(previewUrl);
      }
    });

    await Promise.all(uploads);
  };

  const handleReplaceImage = (index: number) => {
    setReplaceIndex(index);
    replaceFileInputRef.current?.click();
  };

  const handleReplaceImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const targetIndex = replaceIndex;
    setReplaceIndex(null);
    event.target.value = '';

    if (!file || targetIndex === null) {
      return;
    }

    if (!token) {
      setStatusMessage({ type: 'error', message: 'Please login again to upload images.' });
      return;
    }

    const previousImage = images[targetIndex];
    if (!previousImage) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImages((prev) => prev.map((image, idx) => (
      idx === targetIndex
        ? {
            ...image,
            url: previewUrl,
            uploading: true,
            error: undefined,
          }
        : image
    )));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        throw new Error(info?.message || 'Failed to upload image');
      }

      const result = await response.json();

      setImages((prev) => prev.map((image, idx) => (
        idx === targetIndex
          ? {
              ...image,
              url: result.url,
              uploading: false,
            }
          : image
      )));
    } catch (uploadError: any) {
      console.error('Image replace failed', uploadError);
      setStatusMessage({
        type: 'error',
        message: uploadError.message || 'Failed to replace image. Please try again.',
      });
      setImages((prev) => prev.map((image, idx) => (
        idx === targetIndex ? { ...previousImage } : image
      )));
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleAddImageFromUrl = () => {
    const trimmedUrl = newImageUrl.trim();
    if (!trimmedUrl) {
      setStatusMessage({ type: 'error', message: 'Please provide a valid image URL.' });
      return;
    }

    try {
      const urlObject = new URL(trimmedUrl);
      if (!/^https?:/.test(urlObject.protocol)) {
        throw new Error('Only http and https URLs are allowed.');
      }
    } catch (urlError: any) {
      setStatusMessage({ type: 'error', message: urlError.message || 'Invalid image URL.' });
      return;
    }

    setImages((prev) => ([
      ...prev,
      {
        id: createImageId(),
        url: trimmedUrl,
        alt: newImageAlt.trim(),
      },
    ]));
    setNewImageUrl('');
    setNewImageAlt('');
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-white">Loading editor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-400">
        <div className="text-center bg-white/20 backdrop-blur-md rounded-xl p-8 max-w-md">
          <div className="text-2xl font-bold text-white mb-4">Unable to load editor</div>
          <div className="text-white mb-6">{error}</div>
          <button
            onClick={() => router.push('/feed')}
            className="inline-block px-6 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 pb-16">
      {saving && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3 text-purple-700 font-semibold">
            <span className="inline-block h-4 w-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" aria-hidden="true" />
            <span>Saving your changes…</span>
          </div>
        </div>
      )}
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <button
          onClick={() => router.push('/feed')}
          className="mb-6 inline-flex items-center gap-2 text-white font-semibold hover:text-purple-100 transition"
        >
          <span className="text-xl">&#8592;</span>
          <span>Back to My Pages</span>
        </button>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <EditIcon size={36} className="text-purple-600" />
                <span>Edit Website</span>
              </h1>
              <p className="text-gray-600">Update your content, reflect new offers, and keep your site fresh.</p>
            </div>

            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition"
            >
              <EyeIcon size={20} />
              <span>Open Live Preview</span>
            </a>
          </div>

          {statusMessage && (
            <div
              className={`mb-6 rounded-2xl px-5 py-4 text-sm font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.message}
            </div>
          )}

          <form className="space-y-10" onSubmit={handleSave}>
            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">Brand Basics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Business Name</span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) => setForm((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Tagline</span>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(event) => setForm((prev) => (prev ? { ...prev, tagline: event.target.value } : prev))}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={160}
                    required
                  />
                  <span className="text-xs text-gray-400 text-right">{form.tagline?.length || 0}/160</span>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Theme Color</span>
                  <select
                    value={form.theme_color}
                    onChange={(event) => setForm((prev) => (prev ? { ...prev, theme_color: event.target.value } : prev))}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {['purple', 'pink', 'blue', 'green', 'teal', 'red', 'orange', 'yellow', 'indigo', 'gray'].map((color) => (
                      <option key={color} value={color}>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Business Type</span>
                  <input
                    type="text"
                    value={form.businessType || ''}
                    onChange={(event) => setForm((prev) => (prev ? { ...prev, businessType: event.target.value } : prev))}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 mt-6">
                <span className="text-sm font-semibold text-gray-600">Elevator Pitch</span>
                <textarea
                  value={form.description || ''}
                  onChange={(event) => setForm((prev) => (prev ? { ...prev, description: event.target.value } : prev))}
                  className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                />
              </label>

              <label className="flex flex-col gap-2 mt-6">
                <span className="text-sm font-semibold text-gray-600">Instagram Handle</span>
                <input
                  type="text"
                  value={form.instagram || ''}
                  onChange={(event) => setForm((prev) => (prev ? { ...prev, instagram: event.target.value.replace('@', '') } : prev))}
                  className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="vaaniweb"
                />
              </label>
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">Template Details &amp; Meta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Primary Location</span>
                  <input
                    type="text"
                    value={form.sections?.location || ''}
                    onChange={(event) => updateSectionField('location', event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Bengaluru, India"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Event / Launch Date</span>
                  <input
                    type="text"
                    value={form.sections?.date || ''}
                    onChange={(event) => updateSectionField('date', event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="12 July 2025"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Registration Deadline</span>
                  <input
                    type="text"
                    value={form.sections?.deadline || ''}
                    onChange={(event) => updateSectionField('deadline', event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="2025-07-10T09:00:00+05:30"
                  />
                  <span className="text-xs text-gray-400">Use ISO datetime for countdown timers.</span>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Contact Phone</span>
                  <input
                    type="text"
                    value={form.sections?.phone || ''}
                    onChange={(event) => updateSectionField('phone', event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 98765 43210"
                  />
                </label>
                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-semibold text-gray-600">Hero Stats / CTA Ribbon</span>
                  <input
                    type="text"
                    value={form.sections?.cta || ''}
                    onChange={(event) => updateSectionField('cta', event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="500+ delegates • 40 speakers • 12 workshops"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Focus Areas</span>
                  <textarea
                    value={form.sections?.focus || ''}
                    onChange={(event) => updateSectionField('focus', event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                    placeholder="Product engineering • UX systems • Data-informed storytelling"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Preferred Roles</span>
                  <textarea
                    value={form.sections?.roles || ''}
                    onChange={(event) => updateSectionField('roles', event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                    placeholder="Product engineer • UX engineer • Technical PM"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Availability Window</span>
                  <input
                    type="text"
                    value={form.sections?.availability || ''}
                    onChange={(event) => updateSectionField('availability', event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Available for internships from June 2025"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Academic Highlight / GPA</span>
                  <input
                    type="text"
                    value={form.sections?.gpa || ''}
                    onChange={(event) => updateSectionField('gpa', event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="CGPA 8.7 / 10"
                  />
                </label>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-purple-700">Skill Stacks &amp; Expertise</h2>
                  <p className="text-sm text-gray-500">Break down your toolkit for templates that surface grouped skills.</p>
                </div>
                <button
                  type="button"
                  onClick={addSkillGroup}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  + Add Skill Group
                </button>
              </div>
              {skills.length === 0 && (
                <p className="text-sm text-gray-500 mb-6">No skill groups yet. Add at least one to unlock richer portfolio layouts.</p>
              )}
              <div className="space-y-6">
                {skills.map((group, index) => (
                  <div key={group.id} className="border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-gray-700">Skill Group #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeSkillGroup(group.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Remove skill group"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">Category</span>
                        <input
                          type="text"
                          value={group.category}
                          onChange={(event) => updateSkillGroup(group.id, 'category', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Frontend"
                        />
                      </label>
                      <label className="flex flex-col gap-2 md:col-span-1">
                        <span className="text-xs font-semibold text-gray-500">Items (comma or new line)</span>
                        <textarea
                          value={group.items}
                          onChange={(event) => updateSkillGroup(group.id, 'items', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                          placeholder="React, TypeScript, Tailwind"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Tip: These surface as badges or grouped lists in portfolio templates.</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">Story & Highlights</h2>
              <label className="flex flex-col gap-2 mb-6">
                <span className="text-sm font-semibold text-gray-600">About Section</span>
                <textarea
                  value={form.sections?.about || ''}
                  onChange={(event) => updateSectionField('about', event.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[140px]"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 mb-6">
                <span className="text-sm font-semibold text-gray-600">Call To Action</span>
                <input
                  type="text"
                  value={form.sections?.callToAction || ''}
                  onChange={(event) => updateSectionField('callToAction', event.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={120}
                />
                <span className="text-xs text-gray-400 text-right">{form.sections?.callToAction?.length || 0}/120</span>
              </label>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Key Features (one per line)</span>
                <label className="flex items-center gap-2 text-xs font-semibold text-purple-600">
                  <input
                    type="checkbox"
                    checked={sectionsEnabled.features}
                    onChange={(event) => setSectionsEnabled((prev) => ({ ...prev, features: event.target.checked }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Visible on site</span>
                </label>
              </div>
              <textarea
                value={featuresText}
                onChange={(event) => setFeaturesText(event.target.value)}
                className={`rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] ${!sectionsEnabled.features ? 'bg-gray-100 text-gray-400 focus:ring-0 focus:outline-none' : ''}`}
                placeholder="24/7 Support\nCertified Trainers\nSame-day Delivery"
                disabled={!sectionsEnabled.features}
              />
              {!sectionsEnabled.features && (
                <p className="mt-2 text-xs text-gray-500">Section hidden. Re-enable to show features on the published page.</p>
              )}
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">Visual Library & SEO</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Hero & Gallery Images</p>
                      <p className="text-xs text-gray-500">Upload high-quality visuals or drop in hosted URLs. First image becomes the hero banner.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={triggerFilePicker}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-purple-600 text-white shadow hover:bg-purple-700 transition"
                      >
                        Upload from device
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <input
                        ref={replaceFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleReplaceImageFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.length === 0 && (
                      <div className="border border-dashed border-purple-200 rounded-2xl p-6 text-center text-sm text-gray-500">
                        No images yet. Upload a file or paste a public URL below.
                      </div>
                    )}
                    {images.map((image, index) => (
                      <div key={image.id} className="border border-gray-200 rounded-2xl p-4 space-y-3">
                        <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gray-100">
                          <Image
                            src={image.url}
                            alt={image.alt || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover"
                            loading="lazy"
                            sizes="160px"
                            unoptimized
                          />
                          {image.uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-purple-600 text-sm font-semibold">
                              Uploading...
                            </div>
                          )}
                        </div>
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-gray-500">Alt text / caption</span>
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(event) => handleImageAltChange(index, event.target.value)}
                            className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Describe the scene for accessibility"
                            disabled={image.uploading}
                          />
                        </label>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleMoveImage(index, 'up')}
                              className="px-3 py-1 text-xs font-semibold rounded-lg border border-gray-200 hover:border-purple-400 hover:text-purple-600 transition"
                              disabled={index === 0}
                            >
                              ↑ Move up
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveImage(index, 'down')}
                              className="px-3 py-1 text-xs font-semibold rounded-lg border border-gray-200 hover:border-purple-400 hover:text-purple-600 transition"
                              disabled={index === images.length - 1}
                            >
                              ↓ Move down
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleReplaceImage(index)}
                              className="px-3 py-1 text-xs font-semibold rounded-lg border border-blue-200 text-blue-500 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-60"
                              disabled={image.uploading}
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="px-3 py-1 text-xs font-semibold rounded-lg border border-red-200 text-red-500 hover:border-red-400 hover:text-red-600 transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(event) => setNewImageUrl(event.target.value)}
                      placeholder="https://public-host.com/your-image.jpg"
                      className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      value={newImageAlt}
                      onChange={(event) => setNewImageAlt(event.target.value)}
                      placeholder="Alt text (optional)"
                      className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageFromUrl}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow hover:bg-black transition"
                    >
                      Add image from URL
                    </button>
                  </div>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">SEO Keywords (comma separated)</span>
                  <textarea
                    value={seoKeywordsText}
                    onChange={(event) => setSeoKeywordsText(event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[160px]"
                    placeholder="delhi wedding planner, destination weddings india, budget wedding packages"
                  />
                </label>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-purple-700">Services</h2>
                  <label className="flex items-center gap-2 text-xs font-semibold text-purple-600">
                    <input
                      type="checkbox"
                      checked={sectionsEnabled.services}
                      onChange={(event) => setSectionsEnabled((prev) => ({ ...prev, services: event.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Visible on site</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addService}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  + Add Service
                </button>
              </div>

              {!sectionsEnabled.services && (
                <p className="text-xs text-gray-500 mb-4">Section hidden. Visitors won’t see services until you toggle it back on.</p>
              )}

              {services.length === 0 && (
                <p className="text-sm text-gray-500 mb-4">No services listed yet. Add a few to showcase your offerings.</p>
              )}

              <div className="space-y-6">
                {services.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-gray-700">Service #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-gray-400 hover:text-red-500"
                        title="Remove service"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">Title</span>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(event) => updateService(index, 'title', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Premium Bridal Makeup"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">Emoji/Icon</span>
                        <input
                          type="text"
                          value={service.icon || ''}
                          onChange={(event) => updateService(index, 'icon', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="✨"
                          maxLength={4}
                        />
                      </label>
                    </div>
                    <label className="flex flex-col gap-2 mt-4">
                      <span className="text-xs font-semibold text-gray-500">Description</span>
                      <textarea
                        value={service.description}
                        onChange={(event) => updateService(index, 'description', event.target.value)}
                        className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[90px]"
                        placeholder="Describe what clients receive, typical duration, and why it's special."
                      />
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">Timeline</span>
                        <input
                          type="text"
                          value={service.timeline || ''}
                          onChange={(event) => updateService(index, 'timeline', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Jan 2025 – Mar 2025"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">Role</span>
                        <input
                          type="text"
                          value={service.role || ''}
                          onChange={(event) => updateService(index, 'role', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Product Engineer"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">Team / Size</span>
                        <input
                          type="text"
                          value={service.team || ''}
                          onChange={(event) => updateService(index, 'team', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Team of 4"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">Outcome / Impact</span>
                        <input
                          type="text"
                          value={service.outcome || ''}
                          onChange={(event) => updateService(index, 'outcome', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Adopted by 30+ routes"
                        />
                      </label>
                    </div>
                    <label className="flex flex-col gap-2 mt-4">
                      <span className="text-xs font-semibold text-gray-500">Key Takeaways / Summary</span>
                      <textarea
                        value={service.summary || ''}
                        onChange={(event) => updateService(index, 'summary', event.target.value)}
                        className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                        placeholder="List the punchline outcomes or lessons learned."
                      />
                    </label>
                    <label className="flex flex-col gap-2 mt-4">
                      <span className="text-xs font-semibold text-gray-500">Feature Image URL</span>
                      <input
                        type="url"
                        value={service.image || ''}
                        onChange={(event) => updateService(index, 'image', event.target.value)}
                        className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://res.cloudinary.com/..."
                      />
                      {images.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>Quick insert:</span>
                          <select
                            className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                            defaultValue=""
                            onChange={(event) => {
                              if (!event.target.value) {
                                return;
                              }
                              handleServiceGallerySelect(index, event.target.value);
                              event.target.value = '';
                            }}
                          >
                            <option value="">Choose from gallery…</option>
                            {images.map((img, imgIndex) => (
                              <option key={`${img.id}-${imgIndex}`} value={img.url}>
                                Gallery #{imgIndex + 1}{img.alt ? ` — ${img.alt}` : ''}
                              </option>
                            ))}
                          </select>
                          {service.image && (
                            <button
                              type="button"
                              onClick={() => updateService(index, 'image', '')}
                              className="px-2 py-1 rounded border border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500 transition"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-purple-700">Testimonials</h2>
                  <label className="flex items-center gap-2 text-xs font-semibold text-purple-600">
                    <input
                      type="checkbox"
                      checked={sectionsEnabled.testimonials}
                      onChange={(event) => setSectionsEnabled((prev) => ({ ...prev, testimonials: event.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Visible on site</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addTestimonial}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  + Add Testimonial
                </button>
              </div>

              {!sectionsEnabled.testimonials && (
                <p className="text-xs text-gray-500 mb-4">Testimonials are hidden. Toggle visibility to showcase social proof.</p>
              )}

              {testimonials.length === 0 && (
                <p className="text-sm text-gray-500 mb-4">Collect a few heartfelt reviews to build instant trust.</p>
              )}

              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-gray-700">Testimonial #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="text-gray-400 hover:text-red-500"
                        title="Remove testimonial"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-xs font-semibold text-gray-500">Name</span>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(event) => updateTestimonial(index, 'name', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Aisha Singh"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">Role / Context</span>
                        <input
                          type="text"
                          value={testimonial.role}
                          onChange={(event) => updateTestimonial(index, 'role', event.target.value)}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Destination Bride"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">Rating (1-5)</span>
                        <input
                          type="number"
                          value={testimonial.rating ?? 5}
                          min={1}
                          max={5}
                          onChange={(event) => updateTestimonial(index, 'rating', Number(event.target.value))}
                          className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </label>
                    </div>
                    <label className="flex flex-col gap-2 mt-4">
                      <span className="text-xs font-semibold text-gray-500">Quote</span>
                      <textarea
                        value={testimonial.quote}
                        onChange={(event) => updateTestimonial(index, 'quote', event.target.value)}
                        className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[90px]"
                        placeholder="Share the transformation, experience, or results your client enjoyed."
                      />
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-purple-700">Frequently Asked Questions</h2>
                  <label className="flex items-center gap-2 text-xs font-semibold text-purple-600">
                    <input
                      type="checkbox"
                      checked={sectionsEnabled.faq}
                      onChange={(event) => setSectionsEnabled((prev) => ({ ...prev, faq: event.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Visible on site</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  + Add FAQ
                </button>
              </div>

              {!sectionsEnabled.faq && (
                <p className="text-xs text-gray-500 mb-4">FAQs are hidden. Toggle the switch to answer visitor questions publicly.</p>
              )}

              {faqs.length === 0 && (
                <p className="text-sm text-gray-500 mb-4">Answer common queries upfront to boost conversions.</p>
              )}

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-gray-700">FAQ #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="text-gray-400 hover:text-red-500"
                        title="Remove FAQ"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </div>
                    <label className="flex flex-col gap-2 mb-4">
                      <span className="text-xs font-semibold text-gray-500">Question</span>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(event) => updateFaq(index, 'question', event.target.value)}
                        className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="How long does delivery take?"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-gray-500">Answer</span>
                      <textarea
                        value={faq.answer}
                        onChange={(event) => updateFaq(index, 'answer', event.target.value)}
                        className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                        placeholder="We fulfill most orders in 3-5 business days across India."
                      />
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">Lead Form Fields</h2>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-600">Fields (one per line)</span>
                <textarea
                  value={contactFieldsText}
                  onChange={(event) => setContactFieldsText(event.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                  placeholder={`Name\nEmail\nPhone\nMessage`}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Tip: Include qualifiers like budget, preferred date, or service interest to get richer leads.</p>
            </section>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.push('/feed')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}