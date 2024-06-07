import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_ratelimit.decorators import ratelimit

from trainer_api.consts import Methods, Models
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
                body_json["trainingMethod"] == Methods.SFT.value
                and body_json["baseModel"] == Models.LLAMA2.value
            ):
                # schedule the task and repond immediately
                print("[Worker] Submitting task")
                worker = Worker()
                worker.submit(method=Methods.SFT, model=Models.LLAMA2)

                return JsonResponse(
                    {"status": "success", "message": "Added task to queue"}, status=201
                )
        return JsonResponse({"status": "success", "message": "noop"}, status=201)
    else:
        return JsonResponse(
            {"status": "error", "message": "Invalid request method."}, status=400
        )
