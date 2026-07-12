import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Sparkles, ImagePlus, X, AlertTriangle } from 'lucide-react';
import Input from '../common/Input.jsx';
import Textarea from '../common/Textarea.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import MapPicker from '../map/MapPicker.jsx';
import { COMPLAINT_CATEGORIES } from '../../utils/constants';
import { requiredRule } from '../../utils/validators';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { aiApi } from '../../api/aiApi';

export default function ComplaintForm({ onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { title: '', description: '', category: '', location: null },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const description = watch('description');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const runAiAssist = async () => {
    if (!description || description.trim().length < 15) {
      toast.error('Add a slightly longer description first so AI has something to work with.');
      return;
    }
    setAiLoading(true);
    try {
      const [{ data: categoryRes }, { data: titleRes }, { data: dupRes }] = await Promise.all([
        aiApi.suggestCategory({ description }),
        aiApi.generateTitle({ description }),
        aiApi.checkDuplicate({ description }),
      ]);
      if (categoryRes?.category) setValue('category', categoryRes.category);
      if (titleRes?.title) setValue('title', titleRes.title);
      if (dupRes?.isDuplicate) setDuplicateWarning(dupRes);
      toast.success('AI suggestions applied — feel free to edit them.');
    } catch {
      toast.error('AI assist is unavailable right now. You can fill this in manually.');
    } finally {
      setAiLoading(false);
    }
  };

  const submitHandler = async (values) => {
    if (!values.location) {
      toast.error('Please pin the issue location on the map.');
      return;
    }
    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = (await uploadToCloudinary(imageFile, setUploadProgress)).url;
      } catch {
        toast.error('Image upload failed — you can still submit without a photo.');
      }
    }
    onSubmit({
      ...values,
      latitude: values.location.lat,
      longitude: values.location.lng,
      address: values.location.address,
      imageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      <div>
        <Textarea
          label="Describe the issue"
          placeholder="E.g. Large pothole near the bus stop on MG Road, causing traffic to swerve dangerously…"
          error={errors.description?.message}
          {...register('description', {
            ...requiredRule('Description'),
            minLength: { value: 15, message: 'Add a bit more detail (min. 15 characters)' },
          })}
        />
        <button
          type="button"
          onClick={runAiAssist}
          disabled={aiLoading}
          className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-pulse-600 hover:underline disabled:opacity-50"
        >
          <Sparkles size={13} />
          {aiLoading ? 'Analyzing with AI…' : 'Auto-suggest title, category & duplicates'}
        </button>
      </div>

      {duplicateWarning && (
        <div className="flex items-start gap-2 rounded-lg border border-warn-500/30 bg-warn-500/10 p-3 text-sm text-warn-600">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            This looks similar to {duplicateWarning.matchCount || 'an'} existing report nearby.
            You can still submit — it'll be linked as related.
          </span>
        </div>
      )}

      <Input
        label="Title"
        placeholder="Short, clear summary of the issue"
        error={errors.title?.message}
        {...register('title', requiredRule('Title'))}
      />

      <Controller
        name="category"
        control={control}
        rules={requiredRule('Category')}
        render={({ field }) => (
          <Select
            label="Category"
            placeholder="Select the type of issue"
            options={COMPLAINT_CATEGORIES}
            error={errors.category?.message}
            {...field}
          />
        )}
      />

      <div>
        <label className="label">Photo evidence (optional but recommended)</label>
        {imagePreview ? (
          <div className="relative w-fit">
            <img src={imagePreview} alt="preview" className="h-40 rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
              }}
              className="absolute -right-2 -top-2 rounded-full bg-ink-900 p-1 text-white"
            >
              <X size={12} />
            </button>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-1 h-1 w-full rounded-full bg-ink-100">
                <div
                  className="h-1 rounded-full bg-pulse-600 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-ink-200 text-ink-400 hover:border-pulse-500 hover:text-pulse-600 dark:border-ink-700">
            <ImagePlus size={20} />
            <span className="text-xs font-medium">Click to upload a photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        )}
      </div>

      <div>
        <label className="label">Pin the exact location</label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => <MapPicker value={field.value} onChange={field.onChange} />}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Submit Report
      </Button>
    </form>
  );
}
