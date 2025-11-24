export class JobSeeker {
  id?: number;
  resume?: string;
  skills?: string;
  education?: string;

  constructor(data?: Partial<JobSeeker>) {
    Object.assign(this, data);
  }
}
