'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/app/context/AuthContext';
import { GeneratedPageData } from '@/app/types';
import { EditIcon, EyeIcon, TrashIcon } from '@/app/components/Icons';

interface EditableService {
  title: string;
  description: string;
  icon?: string;
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
  const [imageUrlsText, setImageUrlsText] = useState('');
  const [seoKeywordsText, setSeoKeywordsText] = useState('');
  const [services, setServices] = useState<EditableService[]>([]);
  const [testimonials, setTestimonials] = useState<EditableTestimonial[]>([]);
  const [faqs, setFaqs] = useState<EditableFaq[]>([]);

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
        setImageUrlsText((pageData.pics || []).join('\n'));
        setSeoKeywordsText((pageData.seoKeywords || []).join(', '));
        setServices((pageData.sections?.services || []).map((service) => ({
          title: service?.title || '',
          description: service?.description || '',
          icon: service?.icon || '',
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

    const listFromText = (value: string, splitter: RegExp) => value
      .split(splitter)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    const contactList = listFromText(contactFieldsText, /\n+/);
    const featureList = listFromText(featuresText, /\n+/);
    const imageList = listFromText(imageUrlsText, /\s*\n+/);
    const keywordList = listFromText(seoKeywordsText.replace(/\n/g, ','), /,/);

    const serviceList = services
      .map((service) => ({
        title: service.title.trim(),
        description: service.description.trim(),
        icon: service.icon?.trim() || undefined,
      }))
      .filter((service) => service.title.length > 0 && service.description.length > 0);

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

    const payload: GeneratedPageData = {
      ...form,
      contact_fields: contactList,
      pics: imageList,
      seoKeywords: keywordList,
      sections: {
        ...ensureSectionShape(form.sections),
        features: featureList,
        services: serviceList,
        testimonials: testimonialList,
        faq: faqList,
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
      setImageUrlsText(imageList.join('\n'));
      setSeoKeywordsText(keywordList.join(', '));
      setServices(serviceList);
      setTestimonials(testimonialList);
      setFaqs(faqList);
      setStatusMessage({ type: 'success', message: 'Changes saved successfully. Preview refreshed!' });
    } catch (err: any) {
      console.error('Failed to save page', err);
      setStatusMessage({ type: 'error', message: err.message || 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  const addService = () => setServices((prev) => [...prev, { title: '', description: '', icon: '' }]);
  const removeService = (index: number) => setServices((prev) => prev.filter((_, idx) => idx !== index));
  const updateService = (index: number, field: keyof EditableService, value: string) => {
    setServices((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
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
                    required
                  />
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
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-600">Key Features (one per line)</span>
                <textarea
                  value={featuresText}
                  onChange={(event) => setFeaturesText(event.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                  placeholder="24/7 Support\nCertified Trainers\nSame-day Delivery"
                />
              </label>
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">Media & SEO</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600">Hero & Gallery Image URLs (one per line)</span>
                  <textarea
                    value={imageUrlsText}
                    onChange={(event) => setImageUrlsText(event.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[160px]"
                    placeholder="https://images.example.com/photo-1.jpg"
                  />
                </label>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-700">Services</h2>
                <button
                  type="button"
                  onClick={addService}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  + Add Service
                </button>
              </div>

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
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-700">Testimonials</h2>
                <button
                  type="button"
                  onClick={addTestimonial}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  + Add Testimonial
                </button>
              </div>

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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-700">Frequently Asked Questions</h2>
                <button
                  type="button"
                  onClick={addFaq}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  + Add FAQ
                </button>
              </div>

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