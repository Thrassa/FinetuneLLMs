import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_ratelimit.decorators import ratelimit

from trainer_api.utils.constants import BASE_MODELS, TRAINING_METHODS
from trainer_api.scheduler.task import Task
from trainer_api.scheduler.worker import Worker


@csrf_exempt
@ratelimit(key="ip", rate="10/m", method="POST", block=True)
def train(request):
    if request.method == "POST":
        # potentially all the configs for tune job
        if request.body:
            body_json = json.loads(request.body)
            print("body_json", body_json)
            if (
                body_json["trainingMethod"]
                in map(lambda m: m["name"], TRAINING_METHODS)
                and body_json["baseModel"] in BASE_MODELS
                and body_json["dataset"]["name"] is not None
            ):
                try:
                    # schedule the task and repond immediately
                    print("[Worker] Submitting task")
                    worker = Worker()
                    worker.submit(
                        Task(
                            method=body_json["trainingMethod"],
                            model=body_json["baseModel"],
                            dataset=body_json["dataset"]["name"],
                        )
                    )

                    return JsonResponse(
                        {"status": "success", "message": "Added task to queue"},
                        status=201,
                    )
                except Exception as e:
                    print(f"e={e}")
                    return JsonResponse(
                        {"status": "error", "message": f"An error occurred: {e}"},
                        status=500,
                    )
        return JsonResponse({"status": "success", "message": "noop"}, status=201)
    else:
        return JsonResponse(
            {"status": "error", "message": "Invalid request method."}, status=400
        )
