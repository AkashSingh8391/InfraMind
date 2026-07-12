import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { Card } from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { userApi } from '../../api/userApi';
import { requiredRule } from '../../utils/validators';

export default function Departments() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => userApi.getDepartments().then((r) => r.data),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await userApi.createDepartment(values);
      toast.success('Department created.');
      reset();
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not create department.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Departments</h1>
          <p className="mt-1 text-sm text-ink-400">Departments route complaints to the right teams.</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          New Department
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : data?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((d) => (
            <Card key={d.id}>
              <p className="font-display font-semibold">{d.name}</p>
              <p className="mt-1 text-sm text-ink-400">{d.description}</p>
              <div className="mt-3 flex gap-4 text-xs text-ink-400">
                <span>{d.officerCount} officers</span>
                <span>{d.activeComplaintCount} active</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No departments yet" description="Create your first department to start assigning complaints." />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Department">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Department name" error={errors.name?.message} {...register('name', requiredRule('Name'))} />
          <Input label="Description" error={errors.description?.message} {...register('description')} />
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Create Department
          </Button>
        </form>
      </Modal>
    </div>
  );
}
